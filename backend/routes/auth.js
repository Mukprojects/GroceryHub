const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authMiddleware } = require('../middlewares/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/user
// @desc    Get user profile
// @access  Private
router.get('/user', authMiddleware, authController.getUser);

module.exports = router; 