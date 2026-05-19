import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { modules } from '../modules';
import { UserRole } from '../App';

interface ScreenShellProps {
  userRole: UserRole;
}

const ScreenShell: React.FC<ScreenShellProps> = ({ userRole }) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = modules.find((m) => m.id === moduleId);

  // Permission check
  const hasPermission = module && (
    userRole === 'Admin' || 
    module.category === 'User'
  );

  if (!module || !hasPermission) {
    return <Navigate to="/" replace />;
  }

  const hideIframeHeader = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const style = iframeDoc.createElement('style');
        style.textContent = `
          header, nav:not(.internal-nav) { display: none !important; }
          body { padding-top: 0 !important; }
          .layout-container { padding-top: 0 !important; }
        `;
        iframeDoc.head.appendChild(style);
      }
    } catch (err) {
      console.warn('Could not hide iframe header due to cross-origin restrictions or other error:', err);
    }
  };

  return (
    <div style={styles.container}>
      {module.category !== 'User' && (
        <header style={styles.header}>
          <h2 style={styles.title}>{module.name}</h2>
          <div style={styles.badge}>{module.category}</div>
        </header>
      )}
      <div style={styles.iframeWrapper}>
        <iframe
          src={module.path}
          style={styles.iframe}
          title={module.name}
          frameBorder="0"
          onLoad={hideIframeHeader}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-background)',
  },
  header: {
    padding: '12px 16px',
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-graceful-blush)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '60px', // Space for mobile menu toggle
  },
  title: {
    fontSize: '16px',
    margin: 0,
    color: 'var(--color-rich-berry)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
    fontFamily: 'var(--font-serif)',
  },
  badge: {
    fontSize: '10px',
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)',
  },
  iframeWrapper: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

export default ScreenShell;
