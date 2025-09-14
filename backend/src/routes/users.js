const express = require('express');
const router = express.Router();
const { getDashboardStats, createUser, getAllUsers, getUserById } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/dashboard-stats', authenticateToken, requireAdmin, getDashboardStats);
router.post('/', authenticateToken, requireAdmin, createUser);
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);

module.exports = router;