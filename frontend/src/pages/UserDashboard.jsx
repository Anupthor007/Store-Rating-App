import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { stores, ratings } from '../utils/api';

const UserDashboard = () => {
  const [storesList, setStoresList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingModalStore, setRatingModalStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await stores.getStoresForUser();
      setStoresList(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!selectedRating || !ratingModalStore) return;

    setSubmittingRating(true);
    try {
      await ratings.submitRating({
        storeId: ratingModalStore.id,
        rating: selectedRating
      });
      
      setRatingModalStore(null);
      setSelectedRating(0);
      loadStores();
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const filteredStores = storesList.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating, onClick = null) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={onClick ? () => onClick(star) : undefined}
            style={{
              fontSize: '1.5rem',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              cursor: onClick ? 'pointer' : 'default'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Store Directory
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        {loading ? (
          <p>Loading stores...</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredStores.map((store) => (
              <div
                key={store.id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                    {store.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                    {store.address}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span>Overall Rating:</span>
                    {renderStars(store.overallRating)}
                    <span style={{ color: '#6b7280' }}>
                      ({store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''})
                    </span>
                  </div>
                  {store.userRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span>Your Rating:</span>
                      {renderStars(store.userRating)}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      setRatingModalStore(store);
                      setSelectedRating(store.userRating || 0);
                    }}
                    style={{
                      backgroundColor: store.userRating ? '#10b981' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {store.userRating ? 'Update Rating' : 'Rate Store'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {ratingModalStore && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>
                Rate {ratingModalStore.name}
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>Select your rating:</p>
                {renderStars(selectedRating, setSelectedRating)}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setRatingModalStore(null);
                    setSelectedRating(0);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={!selectedRating || submittingRating}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedRating ? '#2563eb' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedRating ? 'pointer' : 'not-allowed'
                  }}
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;