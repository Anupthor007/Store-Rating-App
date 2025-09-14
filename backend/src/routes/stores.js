const express = require('express');
const router = express.Router();
const { createStore, getAllStores, getStoresForUser, getStoreOwnerDashboard } = require('../controllers/storeController');
const { authenticateToken, requireAdmin, requireNormalUser, requireStoreOwner } = require('../middleware/auth');

router.post('/', authenticateToken, requireAdmin, createStore);
router.get('/admin', authenticateToken, requireAdmin, getAllStores);
router.get('/user', authenticateToken, requireNormalUser, getStoresForUser);
router.get('/owner/dashboard', authenticateToken, requireStoreOwner, getStoreOwnerDashboard);

module.exports = router;