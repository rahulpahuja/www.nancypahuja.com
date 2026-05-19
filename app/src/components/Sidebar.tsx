import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Module } from '../modules';
import { UserRole } from '../App';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userRole: UserRole;
  onLogout: () => Promise<void>;
  modules: Module[];
  showToggle?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, userRole, onLogout, modules, showToggle = true }) => {
  const navigate = useNavigate();
  const categories = userRole === 'Admin' ? ['User', 'Admin', 'Showcase'] : ['User'];
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) return;

    setIsLoggingOut(true);
    try {
      await onLogout();
      setIsOpen(false);
      navigate('/login?returnTo=/view/homepage', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {showToggle && !isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          style={styles.mobileToggle}
          aria-label="Open Menu"
        >
          <Icons.Menu size={24} />
        </button>
      )}

      {isOpen && <div onClick={() => setIsOpen(false)} style={styles.overlay} />}

      <aside style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <h1 style={styles.logoText}>NANCY PAHUJA</h1>
            <p style={styles.logoSubtext}>PROJECT HUB</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            style={styles.closeButton}
          >
            <Icons.X size={24} />
          </button>
        </div>

        <nav style={styles.nav}>
          <div style={styles.categoryGroup}>
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              style={styles.dashboardLink}
            >
              <Icons.LayoutDashboard size={18} style={styles.icon} />
              Hub Dashboard
            </Link>
          </div>

          {categories.map((category) => (
            <div key={category} style={styles.categoryGroup}>
              <h2 style={styles.categoryTitle}>{category}</h2>
              <ul style={styles.list}>
                {modules
                  .filter((m) => m.category === category)
                  .map((module) => {
                    const IconComponent = (Icons as any)[module.icon] || Icons.HelpCircle;
                    return (
                      <li key={module.id} style={styles.listItem}>
                        <NavLink
                          to={`/view/${module.id}`}
                          onClick={() => setIsOpen(false)}
                          style={({ isActive }) => ({
                            ...styles.link,
                            backgroundColor: isActive ? 'var(--color-graceful-blush)' : 'transparent',
                            color: 'var(--color-rich-berry)',
                            fontWeight: isActive ? '600' : '400',
                          })}
                        >
                          <IconComponent size={18} style={styles.icon} />
                          {module.name}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
        
        <div style={styles.footer}>
          <div style={styles.userInfo}>
            <p style={styles.userRoleText}>{userRole} Mode</p>
            <button onClick={handleLogout} style={styles.logoutButton} disabled={isLoggingOut}>
              <Icons.LogOut size={14} style={{ marginRight: '8px' }} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
          <p style={{ marginTop: '12px' }}>© 2026 Nancy Pahuja</p>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          /* No longer forcing transform here to allow desktop toggling */
        }
      `}</style>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '280px',
    height: '100vh',
    backgroundColor: 'var(--color-white)',
    borderRight: '1px solid var(--color-graceful-blush)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    zIndex: 1200,
    transition: 'transform 0.3s ease-in-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--color-graceful-blush)',
  },
  mobileToggle: {
    position: 'fixed',
    top: '12px',
    left: '12px',
    zIndex: 1100,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    padding: '8px',
    color: 'var(--color-rich-berry)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  closeButton: {
    padding: '20px',
    color: 'var(--color-rich-berry)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(2px)',
    zIndex: 1150,
  },
  logoContainer: {
    padding: '40px 24px',
    flex: 1,
  },
  logoText: {
    fontSize: '24px',
    letterSpacing: '2px',
    margin: 0,
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
  },
  logoSubtext: {
    fontSize: '10px',
    letterSpacing: '4px',
    marginTop: '4px',
    opacity: 0.7,
    fontFamily: 'var(--font-sans)',
  },
  nav: {
    flex: 1,
    padding: '24px 16px',
  },
  dashboardLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    color: 'var(--color-rich-berry)',
    backgroundColor: 'rgba(62, 2, 23, 0.05)',
    fontWeight: '600',
    marginBottom: '8px',
    textDecoration: 'none',
  },
  categoryGroup: {
    marginBottom: '24px',
  },
  categoryTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--color-rose-gold)',
    marginBottom: '12px',
    paddingLeft: '12px',
    fontWeight: '700',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: '4px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  icon: {
    marginRight: '12px',
    opacity: 0.8,
  },
  footer: {
    padding: '24px 20px',
    fontSize: '10px',
    textAlign: 'center',
    opacity: 0.8,
    borderTop: '1px solid var(--color-graceful-blush)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  userRoleText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-rose-gold)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    border: 'none',
  }
};

export default Sidebar;
