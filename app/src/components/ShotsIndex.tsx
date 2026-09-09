import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { products, productSwatch } from '../products';
import { useShots } from '../shots/ShotsProvider';

const ShotsIndex: React.FC = () => {
  const { shotsForProduct, loading } = useShots();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Product Shots</h1>
        <p style={styles.subtitle}>Short films of each piece — drape, movement and detail.</p>
      </header>

      {loading ? (
        <p style={styles.muted}>Loading shots…</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => {
            const count = shotsForProduct(product.id).length;
            return (
              <Link key={product.id} to={`/shots/${product.id}`} style={styles.card}>
                <div style={{ ...styles.thumb, background: productSwatch(product.id) }}>
                  <PlayCircle size={40} color="var(--color-rich-berry)" strokeWidth={1.5} />
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{product.name}</h3>
                  <p style={styles.cardMeta}>{product.collection}</p>
                  <span style={styles.badge}>
                    {count > 0 ? `${count} shot${count === 1 ? '' : 's'}` : 'Coming soon'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 'clamp(24px, 5vw, 56px)',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: 'clamp(26px, 6vw, 36px)',
    color: 'var(--color-rich-berry)',
    marginBottom: '8px',
    fontFamily: 'var(--font-serif)',
  },
  subtitle: {
    fontSize: 'clamp(14px, 3.5vw, 17px)',
    opacity: 0.7,
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
  },
  muted: {
    textAlign: 'center',
    opacity: 0.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
    gap: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  thumb: {
    aspectRatio: '4 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: '18px 20px 20px',
  },
  cardTitle: {
    fontSize: '18px',
    margin: '0 0 4px 0',
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
  },
  cardMeta: {
    fontSize: '13px',
    opacity: 0.6,
    marginBottom: '12px',
  },
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    fontWeight: 600,
  },
};

export default ShotsIndex;
