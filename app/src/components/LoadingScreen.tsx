import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC<{ onFinished?: () => void }> = ({ onFinished }) => {
  const [text, setText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const fullText = "NANCY PAHUJA";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          if (onFinished) onFinished();
        }, 1400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div style={{
      ...styles.loader,
      opacity: isFinished ? 0 : 1,
      visibility: isFinished ? 'hidden' : 'visible',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={styles.textContainer}>
          {text.split('').map((char, i) => (
            <span 
              key={i} 
              className="drop-star"
              style={{
                animationDelay: `${i * 0.05}s`
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          {!isFinished && <span className="type-cursor"></span>}
        </h2>
      </div>
      <style>{`
        @keyframes dropStarAnim {
          0% { 
            transform: translateY(-80px) scale(0.4); 
            opacity: 0; 
            text-shadow: 0 0 20px rgba(62, 2, 23, 0.5); 
          }
          50% { 
            opacity: 1; 
            text-shadow: 0 0 10px rgba(62, 2, 23, 0.3); 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
            text-shadow: 0 0 0px transparent; 
          }
        }
        .drop-star {
          animation: dropStarAnim 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
          display: inline-block;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: var(--color-deep-berry);
          margin-left: 4px;
          vertical-align: text-bottom;
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--color-white)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.8s ease-out, visibility 0.8s ease-out',
  },
  textContainer: {
    color: 'var(--color-deep-berry)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: '22px',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    paddingLeft: '0.35em',
    whiteSpace: 'nowrap',
  }
};

export default LoadingScreen;
