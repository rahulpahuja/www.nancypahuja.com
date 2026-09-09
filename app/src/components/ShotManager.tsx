import React, { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { products } from '../products';
import { useShots } from '../shots/ShotsProvider';
import { WatermarkConfig, WatermarkPosition } from '../shots/types';
import WatermarkedVideo from './WatermarkedVideo';

const PREVIEW_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4';

const POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

const SAMPLE_LIBRARY: { title: string; videoUrl: string }[] = [
  { title: 'Runway walk', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { title: 'Fabric detail', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { title: 'Styling reel', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { title: '360° view', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
];

const ShotManager: React.FC = () => {
  const { watermark, saveWatermark, shotsForProduct, addShot, removeShot, loading } = useShots();

  const [productId, setProductId] = useState(products[0].id);
  const [draft, setDraft] = useState<WatermarkConfig>(watermark);
  const [savingWatermark, setSavingWatermark] = useState(false);
  const [watermarkSaved, setWatermarkSaved] = useState(false);

  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [addingShot, setAddingShot] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setDraft(watermark);
  }, [watermark]);

  const watermarkDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(watermark),
    [draft, watermark],
  );

  const shots = shotsForProduct(productId);

  const patchDraft = (patch: Partial<WatermarkConfig>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setWatermarkSaved(false);
  };

  const handleSaveWatermark = async () => {
    setSavingWatermark(true);
    try {
      await saveWatermark(draft);
      setWatermarkSaved(true);
    } finally {
      setSavingWatermark(false);
    }
  };

  const handleAddShot = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedUrl = videoUrl.trim();
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setFormError('Enter a valid video URL (https://…). Storage upload is connected later.');
      return;
    }
    setFormError('');
    setAddingShot(true);
    try {
      await addShot({ productId, title: title.trim() || 'Untitled shot', videoUrl: trimmedUrl });
      setTitle('');
      setVideoUrl('');
    } finally {
      setAddingShot(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Product Shots — Admin</h1>
        <p style={styles.pageSubtitle}>
          Publish short product videos (30–60s) per piece and control the brand watermark shoppers see.
        </p>
      </header>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Brand watermark</h2>
        <div style={styles.watermarkGrid}>
          <div style={styles.fields}>
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(event) => patchDraft({ enabled: event.target.checked })}
              />
              Show watermark on customer videos
            </label>

            <label style={styles.label}>
              Watermark text
              <input
                style={styles.input}
                value={draft.text}
                onChange={(event) => patchDraft({ text: event.target.value })}
                placeholder="NANCY PAHUJA"
              />
            </label>

            <div style={styles.row}>
              <label style={styles.label}>
                Text colour
                <span style={styles.colorField}>
                  <input
                    type="color"
                    style={styles.colorInput}
                    value={draft.textColor}
                    onChange={(event) => patchDraft({ textColor: event.target.value })}
                  />
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    value={draft.textColor}
                    onChange={(event) => patchDraft({ textColor: event.target.value })}
                  />
                </span>
              </label>

              <label style={styles.label}>
                Position
                <select
                  style={styles.input}
                  value={draft.position}
                  onChange={(event) => patchDraft({ position: event.target.value as WatermarkPosition })}
                >
                  {POSITIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={styles.label}>
              Logo image URL
              <input
                style={styles.input}
                value={draft.logoUrl}
                onChange={(event) => patchDraft({ logoUrl: event.target.value })}
                placeholder="/brand/nancy-pahuja-logo.png"
              />
            </label>

            <label style={styles.label}>
              Opacity — {Math.round(draft.opacity * 100)}%
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={draft.opacity}
                onChange={(event) => patchDraft({ opacity: Number(event.target.value) })}
              />
            </label>

            <button
              type="button"
              style={{ ...styles.primaryButton, opacity: watermarkDirty && !savingWatermark ? 1 : 0.6 }}
              onClick={handleSaveWatermark}
              disabled={!watermarkDirty || savingWatermark}
            >
              {savingWatermark ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              {watermarkSaved && !watermarkDirty ? 'Saved' : 'Save watermark'}
            </button>
          </div>

          <div style={styles.previewColumn}>
            <span style={styles.previewLabel}>Live preview</span>
            <WatermarkedVideo src={PREVIEW_VIDEO} watermark={draft} controls muted loop autoPlay />
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Shots by product</h2>

        <label style={styles.label}>
          Product
          <select
            style={styles.input}
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {product.collection}
              </option>
            ))}
          </select>
        </label>

        {loading ? (
          <p style={styles.muted}>Loading shots…</p>
        ) : shots.length === 0 ? (
          <p style={styles.muted}>No shots yet for this product.</p>
        ) : (
          <ul style={styles.shotList}>
            {shots.map((shot) => (
              <li key={shot.id} style={styles.shotItem}>
                <div style={styles.shotInfo}>
                  <span style={styles.shotName}>{shot.title}</span>
                  <span style={styles.shotUrl}>{shot.videoUrl}</span>
                </div>
                <button
                  type="button"
                  style={styles.iconButton}
                  onClick={() => removeShot(shot.id)}
                  aria-label={`Remove ${shot.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddShot} style={styles.form}>
          <label style={styles.label}>
            Shot title
            <input
              style={styles.input}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Drape & movement"
            />
          </label>
          <label style={styles.label}>
            Video URL
            <input
              style={styles.input}
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://…/clip.mp4"
            />
          </label>
          <div style={styles.sampleRow}>
            <span style={styles.sampleLabel}>Quick add sample:</span>
            {SAMPLE_LIBRARY.map((sample) => (
              <button
                key={sample.videoUrl}
                type="button"
                style={styles.chip}
                onClick={() => {
                  setTitle((current) => current || sample.title);
                  setVideoUrl(sample.videoUrl);
                  setFormError('');
                }}
              >
                {sample.title}
              </button>
            ))}
          </div>
          {formError && <p style={styles.error}>{formError}</p>}
          <button
            type="submit"
            style={{ ...styles.primaryButton, opacity: addingShot ? 0.6 : 1 }}
            disabled={addingShot}
          >
            {addingShot ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
            Add shot
          </button>
        </form>
      </section>

      <style>{`@keyframes np-spin { to { transform: rotate(360deg); } } .spin { animation: np-spin 1s linear infinite; }`}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 'clamp(20px, 4vw, 44px)',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  pageHeader: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
  },
  pageSubtitle: {
    fontSize: '14px',
    opacity: 0.7,
    marginTop: '6px',
  },
  card: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-lg)',
    padding: 'clamp(18px, 4vw, 28px)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
    marginBottom: '18px',
  },
  watermarkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '24px',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-rose-gold)',
    flex: 1,
    minWidth: '160px',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-rich-berry)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-graceful-blush)',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: 'var(--color-rich-berry)',
    backgroundColor: 'var(--color-white)',
    width: '100%',
  },
  colorField: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  colorInput: {
    width: '44px',
    height: '40px',
    padding: 0,
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    background: 'none',
  },
  previewColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  previewLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-rose-gold)',
    fontWeight: 700,
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 18px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-rich-berry)',
    color: 'var(--color-white)',
    fontSize: '14px',
    fontWeight: 600,
    alignSelf: 'flex-start',
  },
  muted: {
    opacity: 0.6,
    fontSize: '14px',
    margin: '12px 0',
  },
  shotList: {
    listStyle: 'none',
    padding: 0,
    margin: '14px 0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  shotItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-background)',
  },
  shotInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  shotName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-rich-berry)',
  },
  shotUrl: {
    fontSize: '12px',
    opacity: 0.55,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    flex: '0 0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderTop: '1px solid var(--color-graceful-blush)',
    paddingTop: '18px',
  },
  sampleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
  },
  sampleLabel: {
    fontSize: '12px',
    color: 'var(--color-rose-gold)',
    fontWeight: 600,
  },
  chip: {
    padding: '6px 12px',
    borderRadius: '999px',
    border: '1px solid var(--color-graceful-blush)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-rich-berry)',
    fontSize: '12px',
    fontWeight: 500,
  },
  error: {
    fontSize: '12px',
    color: '#93000a',
    backgroundColor: '#ffdad6',
    borderRadius: 'var(--radius-sm)',
    padding: '10px',
  },
};

export default ShotManager;
