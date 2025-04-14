const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.array('images', 5), // Allow up to 5 images
  productController.createProduct
);

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   GET /api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', productController.getProductBySlug);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.array('images', 5),
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post(
  '/:id/reviews',
  authMiddleware,
  productController.addProductReview
);

module.exports = router;
