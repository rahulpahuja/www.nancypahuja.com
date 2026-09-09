import {
  get,
  onValue,
  push,
  ref,
  remove,
  set,
} from 'firebase/database';
import { database } from '../firebase';
import { DEFAULT_WATERMARK, SAMPLE_SHOTS } from './sampleData';
import { NewShot, Shot, WatermarkConfig } from './types';

export interface ShotsState {
  shots: Shot[];
  watermark: WatermarkConfig;
  /** First snapshot from the backing store has been received. */
  ready: boolean;
  /** Backing store is reachable and writable. */
  ok: boolean;
}

export interface ShotsRepository {
  subscribe(listener: (state: ShotsState) => void): () => void;
  addShot(input: NewShot): Promise<void>;
  removeShot(id: string): Promise<void>;
  saveWatermark(config: WatermarkConfig): Promise<void>;
}

const SHOTS_PATH = 'productShots';
const WATERMARK_PATH = 'productShotsConfig/watermark';
const SEEDED_PATH = 'productShotsConfig/seeded';
const LOCAL_SHOTS_KEY = 'np.productShots';
const LOCAL_WATERMARK_KEY = 'np.productShots.watermark';

function sortShots(shots: Shot[]): Shot[] {
  return [...shots].sort((a, b) => a.createdAt - b.createdAt);
}

function normalizeWatermark(value: Partial<WatermarkConfig> | null | undefined): WatermarkConfig {
  return { ...DEFAULT_WATERMARK, ...(value ?? {}) };
}

function createShot(input: NewShot, id: string): Shot {
  return {
    id,
    productId: input.productId,
    title: input.title.trim() || 'Untitled shot',
    videoUrl: input.videoUrl.trim(),
    createdAt: Date.now(),
  };
}

/** Firebase Realtime Database backed repository (shared across devices). */
function createFirebaseRepository(db: NonNullable<typeof database>): ShotsRepository {
  const seedOnce = async () => {
    try {
      const seeded = await get(ref(db, SEEDED_PATH));
      if (seeded.exists()) return;
      const shotsRecord: Record<string, Omit<Shot, 'id'>> = {};
      SAMPLE_SHOTS.forEach(({ id, ...rest }) => {
        shotsRecord[id] = rest;
      });
      await set(ref(db, SHOTS_PATH), shotsRecord);
      await set(ref(db, WATERMARK_PATH), DEFAULT_WATERMARK);
      await set(ref(db, SEEDED_PATH), true);
    } catch {
      /* Handled by the resilient wrapper, which falls back to local storage. */
    }
  };

  void seedOnce();

  return {
    subscribe(listener) {
      const state: ShotsState = { shots: [], watermark: DEFAULT_WATERMARK, ready: false, ok: true };
      let shotsReady = false;
      let watermarkReady = false;
      let shotsFailed = false;

      const emit = () => {
        state.ready = shotsReady && watermarkReady;
        state.ok = !shotsFailed;
        listener({ ...state, shots: sortShots(state.shots) });
      };

      const unsubscribeShots = onValue(ref(db, SHOTS_PATH), (snapshot) => {
        const value = (snapshot.val() as Record<string, Omit<Shot, 'id'>> | null) ?? {};
        state.shots = Object.entries(value).map(([id, shot]) => ({ ...shot, id }));
        shotsReady = true;
        shotsFailed = false;
        emit();
      }, () => {
        shotsReady = true;
        shotsFailed = true;
        emit();
      });

      const unsubscribeWatermark = onValue(ref(db, WATERMARK_PATH), (snapshot) => {
        state.watermark = normalizeWatermark(snapshot.val());
        watermarkReady = true;
        emit();
      }, () => {
        watermarkReady = true;
        emit();
      });

      return () => {
        unsubscribeShots();
        unsubscribeWatermark();
      };
    },
    async addShot(input) {
      const shotRef = push(ref(db, SHOTS_PATH));
      const { productId, title, videoUrl, createdAt } = createShot(
        input,
        shotRef.key ?? crypto.randomUUID(),
      );
      await set(shotRef, { productId, title, videoUrl, createdAt });
    },
    async removeShot(id) {
      await remove(ref(db, `${SHOTS_PATH}/${id}`));
    },
    async saveWatermark(config) {
      await set(ref(db, WATERMARK_PATH), normalizeWatermark(config));
    },
  };
}

/** Browser-local repository used when Firebase is unavailable. */
function createLocalRepository(): ShotsRepository {
  const listeners = new Set<(state: ShotsState) => void>();

  const readShots = (): Shot[] => {
    try {
      const raw = localStorage.getItem(LOCAL_SHOTS_KEY);
      if (raw === null) {
        localStorage.setItem(LOCAL_SHOTS_KEY, JSON.stringify(SAMPLE_SHOTS));
        return [...SAMPLE_SHOTS];
      }
      const parsed = JSON.parse(raw) as Shot[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [...SAMPLE_SHOTS];
    }
  };

  const readWatermark = (): WatermarkConfig => {
    try {
      const raw = localStorage.getItem(LOCAL_WATERMARK_KEY);
      return raw === null ? DEFAULT_WATERMARK : normalizeWatermark(JSON.parse(raw));
    } catch {
      return DEFAULT_WATERMARK;
    }
  };

  const writeShots = (shots: Shot[]) => {
    try {
      localStorage.setItem(LOCAL_SHOTS_KEY, JSON.stringify(shots));
    } catch {
      /* storage unavailable — changes stay in memory for this session */
    }
  };

  const snapshot = (): ShotsState => ({
    shots: sortShots(readShots()),
    watermark: readWatermark(),
    ready: true,
    ok: true,
  });

  const emit = () => {
    const state = snapshot();
    listeners.forEach((listener) => listener(state));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },
    async addShot(input) {
      writeShots([...readShots(), createShot(input, crypto.randomUUID())]);
      emit();
    },
    async removeShot(id) {
      writeShots(readShots().filter((shot) => shot.id !== id));
      emit();
    },
    async saveWatermark(config) {
      try {
        localStorage.setItem(LOCAL_WATERMARK_KEY, JSON.stringify(normalizeWatermark(config)));
      } catch {
        /* ignore */
      }
      emit();
    },
  };
}

/**
 * Uses Firebase while it is reachable and transparently switches to the
 * browser-local store the first time Firebase reports an error (e.g. database
 * rules not yet opened). Switching to Firebase later needs no code change.
 */
function createResilientRepository(
  buildPrimary: () => ShotsRepository,
  buildFallback: () => ShotsRepository,
): ShotsRepository {
  const primary = buildPrimary();
  const subscribers = new Set<(state: ShotsState) => void>();
  let fallback: ShotsRepository | null = null;
  let usingFallback = false;
  let latest: ShotsState = { shots: [], watermark: DEFAULT_WATERMARK, ready: false, ok: true };
  let unsubscribePrimary: (() => void) | null = null;

  const broadcast = (state: ShotsState) => {
    latest = state;
    subscribers.forEach((listener) => listener(state));
  };

  const ensureFallback = (): ShotsRepository => {
    if (!fallback) fallback = buildFallback();
    return fallback;
  };

  const switchToFallback = () => {
    if (usingFallback) return;
    usingFallback = true;
    console.warn('Product shots: Firebase unavailable, using local storage.');
    unsubscribePrimary?.();
    ensureFallback().subscribe(broadcast);
  };

  unsubscribePrimary = primary.subscribe((state) => {
    if (usingFallback) return;
    if (state.ready && !state.ok) {
      switchToFallback();
      return;
    }
    broadcast(state);
  });

  const write = async (operation: (repo: ShotsRepository) => Promise<void>) => {
    if (usingFallback) {
      await operation(ensureFallback());
      return;
    }
    try {
      await operation(primary);
    } catch {
      switchToFallback();
      await operation(ensureFallback());
    }
  };

  return {
    subscribe(listener) {
      subscribers.add(listener);
      listener(latest);
      return () => subscribers.delete(listener);
    },
    addShot: (input) => write((repo) => repo.addShot(input)),
    removeShot: (id) => write((repo) => repo.removeShot(id)),
    saveWatermark: (config) => write((repo) => repo.saveWatermark(config)),
  };
}

let repository: ShotsRepository | null = null;

export function getShotsRepository(): ShotsRepository {
  if (!repository) {
    const db = database;
    repository = db
      ? createResilientRepository(() => createFirebaseRepository(db), createLocalRepository)
      : createLocalRepository();
  }
  return repository;
}
