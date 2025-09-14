const express = require('express');
const router = express.Router();
const { submitRating, getUserRatings, deleteRating } = require('../controllers/ratingController');
const { authenticateToken, requireNormalUser } = require('../middleware/auth');

router.post('/', authenticateToken, requireNormalUser, submitRating);
router.get('/my-ratings', authenticateToken, requireNormalUser, getUserRatings);
router.delete('/store/:storeId', authenticateToken, requireNormalUser, deleteRating);

module.exports = router;