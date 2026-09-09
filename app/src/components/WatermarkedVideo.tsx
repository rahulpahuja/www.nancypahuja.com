import React from 'react';
import { WatermarkConfig, WatermarkPosition } from '../shots/types';

interface WatermarkedVideoProps {
  src: string;
  watermark: WatermarkConfig;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const positionStyles: Record<WatermarkPosition, React.CSSProperties> = {
  'top-left': { top: '4%', left: '4%', alignItems: 'flex-start' },
  'top-right': { top: '4%', right: '4%', alignItems: 'flex-end' },
  'bottom-left': { bottom: '4%', left: '4%', alignItems: 'flex-start' },
  'bottom-right': { bottom: '4%', right: '4%', alignItems: 'flex-end' },
};

/**
 * Product-shot player. The watermark is a live overlay on top of the <video>
 * element; nothing is burned into the file (that happens server-side once real
 * storage is connected).
 */
const WatermarkedVideo: React.FC<WatermarkedVideoProps> = ({
  src,
  watermark,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
}) => (
  <div style={styles.frame}>
    <video
      style={styles.video}
      src={src}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
    />
    {watermark.enabled && (watermark.logoUrl || watermark.text) && (
      <div
        style={{
          ...styles.watermark,
          ...positionStyles[watermark.position],
          opacity: watermark.opacity,
        }}
      >
        {watermark.logoUrl && (
          <img
            src={watermark.logoUrl}
            alt=""
            style={styles.logo}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
        {watermark.text && (
          <span style={{ ...styles.text, color: watermark.textColor }}>
            {watermark.text}
          </span>
        )}
      </div>
    )}
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  frame: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    lineHeight: 0,
  },
  video: {
    display: 'block',
    width: '100%',
    height: 'auto',
    maxHeight: '70vh',
  },
  watermark: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    pointerEvents: 'none',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
  },
  logo: {
    height: 'clamp(20px, 6vw, 34px)',
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5))',
  },
  text: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(10px, 3vw, 15px)',
    letterSpacing: '0.15em',
    fontWeight: 600,
    lineHeight: 1.2,
  },
};

export default WatermarkedVideo;
