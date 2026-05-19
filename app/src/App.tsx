import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScreenShell from './components/ScreenShell';
import CustomerHeader from './components/CustomerHeader';
import Login from './components/Login';
import LoadingScreen from './components/LoadingScreen';
import { modules } from './modules';

import * as Icons from 'lucide-react';

export type UserRole = 'User' | 'Admin' | null;

const AppLayout: React.FC<{ 
  children: React.ReactNode, 
  userRole: UserRole, 
  onLogout: () => void 
}> = ({ children, userRole, onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isView = location.pathname.startsWith('/view/');
  const moduleId = isView ? location.pathname.split('/')[2] : null;
  const module = modules.find(m => m.id === moduleId);
  
  const isUserCategory = module && module.category === 'User';
  const showCustomerHeader = isView && isUserCategory;

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!userRole && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

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
      />
      <div 
        className="main-content" 
        style={{
          ...styles.mainContent,
          marginLeft: (isUserCategory) ? '0' : '280px',
        }}
      >
        {showCustomerHeader && (
          <CustomerHeader 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            onLogout={onLogout}
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
          {isUserCategory && (
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
            margin-left: ${isUserCategory ? '0' : '280px'} !important;
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
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      {isAppLoading && <LoadingScreen onFinished={() => setIsAppLoading(false)} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/*" 
          element={
            <AppLayout userRole={userRole} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard userRole={userRole} />} />
                <Route path="/view/:moduleId" element={<ScreenShell userRole={userRole} />} />
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
    backgroundColor: 'var(--color-deep-berry)',
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
