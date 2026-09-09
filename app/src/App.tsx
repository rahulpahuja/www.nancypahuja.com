import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScreenShell from './components/ScreenShell';
import CustomerHeader from './components/CustomerHeader';
import Login from './components/Login';
import LoadingScreen from './components/LoadingScreen';
import UserProfile from './components/UserProfile';
import ShotsIndex from './components/ShotsIndex';
import ShotViewer from './components/ShotViewer';
import ShotManager from './components/ShotManager';
import { AuthProvider, useAuth } from './auth';
import { CartProvider } from './cart/CartProvider';
import { ShotsProvider } from './shots/ShotsProvider';
import { modules } from './modules';

import * as Icons from 'lucide-react';

export type UserRole = 'User' | 'Admin';

const AppLayout: React.FC<{ 
  children: React.ReactNode, 
  userRole: UserRole, 
  onLogout: () => Promise<void> 
}> = ({ children, userRole, onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Prototype screens render at /view/:id (customer) or /admin/view/:id (admin).
  const viewMatch = location.pathname.match(/^\/(?:admin\/)?view\/([^/]+)/);
  const moduleId = viewMatch?.[1] ?? null;
  const isView = moduleId !== null;
  const isProfile = location.pathname === '/profile';
  const isShots = location.pathname === '/shots' || location.pathname.startsWith('/shots/');
  const module = modules.find(m => m.id === moduleId);

  const isUserCategory = module && module.category === 'User';
  // Immersive screens are shown full-bleed with the customer chrome and an
  // overlay hub menu instead of the persistent admin sidebar.
  const isImmersive = Boolean(isUserCategory) || isShots;
  const showCustomerHeader = (isView && isUserCategory) || isProfile || isShots;

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Filter modules for sidebar based on role
  const visibleModules = modules.filter(m => {
    if (userRole === 'Admin') return true;
    return m.category === 'User';
  });

  return (
    <div style={styles.appContainer}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userRole={userRole}
        onLogout={onLogout}
        modules={visibleModules}
        showToggle={!showCustomerHeader}
      />
      <div
        className="main-content"
        style={{
          ...styles.mainContent,
          marginLeft: (isImmersive || !isSidebarOpen) ? '0' : '280px',
        }}
      >
        {showCustomerHeader && (
          <CustomerHeader 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        )}
        <main style={{ 
          flex: 1, 
          height: showCustomerHeader ? 'calc(100vh - 80px)' : '100vh',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {children}
          
          {/* Floating Hub Toggle (Escape Hatch) */}
          {isImmersive && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.floatingToggle}
              title="Toggle Hub Menu"
            >
              <Icons.LayoutGrid size={24} />
            </button>
          )}
        </main>
      </div>
      
      {/* Global CSS to handle the desktop sidebar responsiveness based on category */}
      <style>{`
        @media (min-width: 1024px) {
          .main-content {
            margin-left: ${isUserCategory || !isSidebarOpen ? '0' : '280px'} !important;
          }
        }
        @media (max-width: 1023px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <ShotsProvider>
          <AppRoutes />
        </ShotsProvider>
      </CartProvider>
    </AuthProvider>
  );
};

const ROLE_STORAGE_KEY = 'np.userRole';

const readStoredRole = (): UserRole => {
  try {
    return sessionStorage.getItem(ROLE_STORAGE_KEY) === 'Admin' ? 'Admin' : 'User';
  } catch {
    return 'User';
  }
};

const AppRoutes: React.FC = () => {
  const { logout } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(readStoredRole);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    try {
      sessionStorage.setItem(ROLE_STORAGE_KEY, userRole);
    } catch {
      /* session storage unavailable — role stays in memory only */
    }
  }, [userRole]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = async () => {
    await logout();
    setUserRole('User');
  };

  return (
    <Router>
      {isAppLoading && <LoadingScreen onFinished={() => setIsAppLoading(false)} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/admin" element={
          userRole === 'Admin' ? <Navigate to="/hub" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route 
          path="/*" 
          element={
            <AppLayout userRole={userRole} onLogout={handleLogout}>
              <Routes>
                {/* The site opens on the customer storefront; the hub launcher lives at /hub. */}
                <Route path="/" element={<Navigate to="/view/homepage" replace />} />
                <Route path="/hub" element={<Dashboard userRole={userRole} />} />
                <Route path="/view/:moduleId" element={<ScreenShell userRole={userRole} />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/shots" element={<ShotsIndex />} />
                <Route path="/shots/:productId" element={<ShotViewer />} />
                <Route
                  path="/admin/view/:moduleId"
                  element={userRole === 'Admin' ? <ScreenShell userRole={userRole} /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/admin/shots"
                  element={userRole === 'Admin' ? <ShotManager /> : <Navigate to="/" replace />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          } 
        />
      </Routes>
    </Router>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-white)',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.3s ease-in-out',
  },
  floatingToggle: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '28px',
    backgroundColor: 'var(--color-rich-berry)',
    color: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    cursor: 'pointer',
    border: 'none',
    transition: 'transform 0.2s ease',
  },
};

export default App;
