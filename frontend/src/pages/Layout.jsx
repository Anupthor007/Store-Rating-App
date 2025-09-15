import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{
        backgroundColor: '#2563eb',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Store Rating System</h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user.name} ({user.role.replace('_', ' ')})</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;