const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, userController.updateProfile);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', authMiddleware, userController.changePassword);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router; 