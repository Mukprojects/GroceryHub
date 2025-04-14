const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', authMiddleware, orderController.createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', authMiddleware, orderController.getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authMiddleware, orderController.getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', authMiddleware, orderController.updateOrderToPaid);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get('/', authMiddleware, adminMiddleware, orderController.getOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private/Admin
router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
