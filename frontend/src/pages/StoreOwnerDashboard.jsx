import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { stores } from '../utils/api';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await stores.getStoreOwnerDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '1.25rem',
              color: star <= rating ? '#fbbf24' : '#d1d5db'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading dashboard...</p>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>No Store Found</h2>
          <p>You don't have a store associated with your account.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Store Dashboard
        </h1>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            {dashboardData.store.name}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            <strong>Email:</strong> {dashboardData.store.email}
          </p>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            <strong>Address:</strong> {dashboardData.store.address}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '1rem',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0369a1', fontSize: '1.5rem', margin: 0 }}>
                {dashboardData.averageRating.toFixed(1)}/5
              </h3>
              <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Average Rating</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                {renderStars(Math.round(dashboardData.averageRating))}
              </div>
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '1rem',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#166534', fontSize: '1.5rem', margin: 0 }}>
                {dashboardData.totalRatings}
              </h3>
              <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Total Ratings</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Ratings</h3>
          </div>
          
          {dashboardData.ratings.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No ratings yet
            </p>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Customer
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Rating
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.ratings.map((rating) => (
                    <tr key={rating.id}>
                      <td style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: '500' }}>{rating.user.name}</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            {rating.user.email}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {renderStars(rating.rating)}
                          <span style={{ fontWeight: '500' }}>({rating.rating}/5)</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', borderTop: '1px solid #f3f4f6', color: '#6b7280' }}>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StoreOwnerDashboard;