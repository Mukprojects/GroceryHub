const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private/Admin
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  categoryController.createCategory
);

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', categoryController.getCategoryById);

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  categoryController.updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
