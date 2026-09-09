import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { findProduct } from '../products';
import { useShots } from '../shots/ShotsProvider';
import WatermarkedVideo from './WatermarkedVideo';

const ShotViewer: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = findProduct(productId);
  const { shotsForProduct, watermark, loading } = useShots();
  const [activeId, setActiveId] = useState<string | null>(null);

  const shots = product ? shotsForProduct(product.id) : [];

  useEffect(() => {
    if (shots.length && !shots.some((shot) => shot.id === activeId)) {
      setActiveId(shots[0].id);
    }
  }, [shots, activeId]);

  if (!product) {
    return <Navigate to="/shots" replace />;
  }

  const activeShot = shots.find((shot) => shot.id === activeId) ?? shots[0];

  return (
    <div style={styles.container}>
      <Link to="/shots" style={styles.back}>
        <ArrowLeft size={16} />
        All product shots
      </Link>

      <header style={styles.header}>
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.meta}>{product.collection}</p>
      </header>

      {loading ? (
        <p style={styles.muted}>Loading shots…</p>
      ) : !activeShot ? (
        <p style={styles.muted}>No shots have been published for this piece yet.</p>
      ) : (
        <div style={styles.player}>
          <WatermarkedVideo key={activeShot.id} src={activeShot.videoUrl} watermark={watermark} />
          <p style={styles.shotTitle}>{activeShot.title}</p>

          {shots.length > 1 && (
            <div style={styles.strip}>
              {shots.map((shot) => (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => setActiveId(shot.id)}
                  style={{
                    ...styles.stripItem,
                    ...(shot.id === activeShot.id ? styles.stripItemActive : null),
                  }}
                >
                  {shot.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 'clamp(20px, 5vw, 48px)',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-rose-gold)',
    marginBottom: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: 'clamp(24px, 5.5vw, 34px)',
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
  },
  meta: {
    fontSize: '14px',
    opacity: 0.6,
    marginTop: '4px',
  },
  muted: {
    opacity: 0.6,
  },
  player: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  shotTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-rich-berry)',
  },
  strip: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  stripItem: {
    flex: '0 0 auto',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-graceful-blush)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-rich-berry)',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  stripItemActive: {
    backgroundColor: 'var(--color-graceful-blush)',
    fontWeight: 700,
  },
};

export default ShotViewer;
