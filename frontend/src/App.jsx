import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            user?.role === 'SYSTEM_ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
            user?.role === 'STORE_OWNER' ? <Navigate to="/store-owner/dashboard" replace /> :
            <Navigate to="/user/dashboard" replace />
          ) : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/user/dashboard" replace /> : <Register />} 
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['NORMAL_USER']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/unauthorized"
        element={
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            textAlign: 'center'
          }}>
            <h1>Unauthorized Access</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        }
      />
      
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'SYSTEM_ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
            user?.role === 'STORE_OWNER' ? <Navigate to="/store-owner/dashboard" replace /> :
            <Navigate to="/user/dashboard" replace />
          ) : <Navigate to="/login" replace />
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;