import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
};

export const users = {
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  createUser: (userData) => api.post('/users', userData),
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
};

export const stores = {
  createStore: (storeData) => api.post('/stores', storeData),
  getAllStores: (params) => api.get('/stores/admin', { params }),
  getStoresForUser: (params) => api.get('/stores/user', { params }),
  getStoreOwnerDashboard: () => api.get('/stores/owner/dashboard'),
};

export const ratings = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getUserRatings: () => api.get('/ratings/my-ratings'),
  deleteRating: (storeId) => api.delete(`/ratings/store/${storeId}`),
};

export default api;