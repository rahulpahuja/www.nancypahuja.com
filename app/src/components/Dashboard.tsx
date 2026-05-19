import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Module, modules } from '../modules';
import { UserRole } from '../App';

interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const visibleModules = modules.filter(m => {
    if (userRole === 'Admin') return true;
    return m.category === 'User';
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, {userRole || 'Guest'}</h1>
        <p style={styles.subtitle}>
          {userRole === 'Admin' 
            ? 'Administrator Hub - Access to all prototypes and management tools.' 
            : 'Customer Portal - Explore our latest collections and heritage.'}
        </p>
      </header>

      <div style={styles.grid}>
        {visibleModules.map((module) => {
          const IconComponent = (Icons as any)[module.icon] || Icons.HelpCircle;
          return (
            <Link key={module.id} to={`/view/${module.id}`} style={styles.card}>
              <div style={styles.cardIcon}>
                <IconComponent size={32} color="var(--color-rose-gold)" />
              </div>
              <h3 style={styles.cardTitle}>{module.name}</h3>
              <p style={styles.cardCategory}>{module.category}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '48px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    color: 'var(--color-rich-berry)',
    marginBottom: '12px',
    fontFamily: 'var(--font-serif)',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.7,
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px 24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    display: 'block',
  },
  cardIcon: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    margin: '0 0 8px 0',
    color: 'var(--color-rich-berry)',
    fontFamily: 'var(--font-serif)',
  },
  cardCategory: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: 0.5,
    fontFamily: 'var(--font-sans)',
  },
};

export default Dashboard;
