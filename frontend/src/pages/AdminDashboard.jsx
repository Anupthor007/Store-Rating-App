import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { users, stores } from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await users.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await users.getAllUsers();
      setUsersList(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await stores.getAllStores();
      setStoresList(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') loadUsers();
    if (tab === 'stores') loadStores();
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isActive ? '#2563eb' : '#e5e7eb',
    color: isActive ? 'white' : '#374151',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0'
  });

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Admin Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => handleTabChange('stats')}
            style={tabStyle(activeTab === 'stats')}
          >
            Statistics
          </button>
          <button
            onClick={() => handleTabChange('users')}
            style={tabStyle(activeTab === 'users')}
          >
            Users
          </button>
          <button
            onClick={() => handleTabChange('stores')}
            style={tabStyle(activeTab === 'stores')}
          >
            Stores
          </button>
        </div>

        {activeTab === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={cardStyle}>
              <h3 style={{ color: '#2563eb', fontSize: '2rem', margin: 0 }}>{stats.totalUsers}</h3>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>Total Users</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: '#10b981', fontSize: '2rem', margin: 0 }}>{stats.totalStores}</h3>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>Total Stores</p>
            </div>
            <div style={cardStyle}>
              <h3 style={{ color: '#f59e0b', fontSize: '2rem', margin: 0 }}>{stats.totalRatings}</h3>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>Total Ratings</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</p>
            ) : (
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Role</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Address</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr key={user.id}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{user.name}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{user.email}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: user.role === 'SYSTEM_ADMIN' ? '#dbeafe' : user.role === 'STORE_OWNER' ? '#dcfce7' : '#fef3c7',
                            color: user.role === 'SYSTEM_ADMIN' ? '#1e40af' : user.role === 'STORE_OWNER' ? '#166534' : '#92400e',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.address}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                          {user.storeRating ? `${user.storeRating}/5` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stores' && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Loading stores...</p>
            ) : (
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Store Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Address</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Owner</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Rating</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Total Ratings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storesList.map((store) => (
                      <tr key={store.id}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{store.name}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{store.email}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {store.address}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{store.owner?.name}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: store.rating >= 4 ? '#dcfce7' : store.rating >= 3 ? '#fef3c7' : '#fee2e2',
                            color: store.rating >= 4 ? '#166534' : store.rating >= 3 ? '#92400e' : '#dc2626',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {store.rating > 0 ? `${store.rating}/5` : 'No ratings'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{store.totalRatings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;