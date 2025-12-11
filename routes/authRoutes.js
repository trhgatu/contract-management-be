const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateProfile
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin only routes
router.post('/register', protect, authorize('admin'), register);

module.exports = router;
