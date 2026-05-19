import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, LogOut } from 'lucide-react';
import { modules } from '../modules';

interface CustomerHeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onMenuClick, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.left}>
          <button style={styles.iconButton} onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <div style={styles.logo} onClick={() => navigate('/')}>
            NANCY PAHUJA
          </div>
        </div>

        <nav style={styles.nav} className="desktop-only">
          <NavLink to="/view/homepage" style={styles.navLink}>Home</NavLink>
          <NavLink to="/view/product_listing" style={styles.navLink}>Shop</NavLink>
          <NavLink to="/view/artisanal_heritage" style={styles.navLink}>Our Story</NavLink>
          <NavLink to="/view/order_history" style={styles.navLink}>Orders</NavLink>
        </nav>

        <div style={styles.right}>
          <button style={styles.iconButton}>
            <Search size={20} />
          </button>
          <div className="user-menu-container" style={{ position: 'relative' }}>
            <button style={styles.iconButton} onClick={onLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
          <button style={styles.iconButton} onClick={() => navigate('/view/cart_checkout')}>
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
        }
      `}</style>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: '80px',
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-graceful-blush)',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '600',
    letterSpacing: '3px',
    color: 'var(--color-deep-berry)',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
  },
  nav: {
    display: 'flex',
    gap: '32px',
  },
  navLink: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-deep-berry)',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
  right: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  iconButton: {
    color: 'var(--color-deep-berry)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
};

export default CustomerHeader;
