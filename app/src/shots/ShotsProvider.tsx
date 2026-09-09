import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getShotsRepository, ShotsState } from './shotsRepository';
import { DEFAULT_WATERMARK } from './sampleData';
import { NewShot, Shot, WatermarkConfig } from './types';

interface ShotsContextValue {
  shots: Shot[];
  watermark: WatermarkConfig;
  loading: boolean;
  shotsForProduct: (productId: string) => Shot[];
  addShot: (input: NewShot) => Promise<void>;
  removeShot: (id: string) => Promise<void>;
  saveWatermark: (config: WatermarkConfig) => Promise<void>;
}

const ShotsContext = createContext<ShotsContextValue | null>(null);

const initialState: ShotsState = {
  shots: [],
  watermark: DEFAULT_WATERMARK,
  ready: false,
  ok: true,
};

export const ShotsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repository = useMemo(getShotsRepository, []);
  const [state, setState] = useState<ShotsState>(initialState);

  useEffect(() => repository.subscribe(setState), [repository]);

  const value = useMemo<ShotsContextValue>(() => ({
    shots: state.shots,
    watermark: state.watermark,
    loading: !state.ready,
    shotsForProduct: (productId) => state.shots.filter((shot) => shot.productId === productId),
    addShot: repository.addShot,
    removeShot: repository.removeShot,
    saveWatermark: repository.saveWatermark,
  }), [repository, state]);

  return <ShotsContext.Provider value={value}>{children}</ShotsContext.Provider>;
};

export function useShots(): ShotsContextValue {
  const context = useContext(ShotsContext);
  if (!context) throw new Error('useShots must be used within a ShotsProvider');
  return context;
}
