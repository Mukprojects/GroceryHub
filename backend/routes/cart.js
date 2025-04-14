const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { authMiddleware } = require('../middlewares/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', authMiddleware, cartController.getCart);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', authMiddleware, cartController.addToCart);

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', authMiddleware, cartController.updateCartItem);

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', authMiddleware, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
