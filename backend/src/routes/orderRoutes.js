const express = require('express');
const {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const {
  authMiddleware,
  requireUser,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// User orders
router.get('/my', authMiddleware, requireUser, getMyOrders);

// Admin orders - list all
router.get('/', authMiddleware, requireAdmin, getAllOrders);

// ✅ Admin order status update
router.patch('/:id/status', authMiddleware, requireAdmin, updateOrderStatus);

module.exports = router;
