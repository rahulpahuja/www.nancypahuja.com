import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import LoadingScreen from './LoadingScreen';

interface LoginProps {
  onLogin: (role: 'User' | 'Admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<'User' | 'Admin' | null>(null);

  const handleMockLogin = (role: 'User' | 'Admin') => {
    setPendingRole(role);
    setLoading(true);
  };

  if (loading && pendingRole) {
    return <LoadingScreen onFinished={() => {
      onLogin(pendingRole);
      navigate('/');
    }} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>NANCY PAHUJA</h1>
          <p style={styles.logoSubtext}>PREMIUM ARTISANAL APPAREL</p>
        </div>

        <div style={styles.content}>
          <h2 style={styles.title}>Welcome to the Hub</h2>
          <p style={styles.subtitle}>Please sign in to access the platform prototypes and management tools.</p>

          <div style={styles.buttonGroup}>
            <button 
              onClick={() => handleMockLogin('User')} 
              style={styles.googleButton}
              disabled={loading}
            >
              <LogIn size={20} style={styles.icon} />
              {loading ? 'Signing in...' : 'Sign in as Customer'}
            </button>

            <button 
              onClick={() => handleMockLogin('Admin')} 
              style={styles.adminButton}
              disabled={loading}
            >
              {loading ? 'Accessing...' : 'Sign in as Administrator'}
            </button>
          </div>
          
          <p style={styles.policyNote}>
            By signing in, you agree to our <span style={styles.link}>Terms of Service</span> and <span style={styles.link}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-graceful-blush)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'var(--color-white)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(74, 59, 61, 0.1)',
    overflow: 'hidden',
    textAlign: 'center',
  },
  logoContainer: {
    padding: '48px 24px 32px',
    borderBottom: '1px solid var(--color-graceful-blush)',
    backgroundColor: 'var(--color-white)',
  },
  logoText: {
    fontSize: '28px',
    letterSpacing: '4px',
    margin: 0,
    color: 'var(--color-deep-berry)',
    fontFamily: 'var(--font-serif)',
  },
  logoSubtext: {
    fontSize: '10px',
    letterSpacing: '3px',
    marginTop: '8px',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  content: {
    padding: '40px 48px',
  },
  title: {
    fontSize: '22px',
    color: 'var(--color-deep-berry)',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-deep-berry)',
    opacity: 0.6,
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-deep-berry)',
    color: 'var(--color-white)',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  adminButton: {
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-rose-blush)',
    color: 'var(--color-rose-blush)',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  icon: {
    opacity: 0.9,
  },
  policyNote: {
    fontSize: '12px',
    color: 'var(--color-deep-berry)',
    opacity: 0.5,
    marginTop: '16px',
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  }
};

export default Login;
