const express = require('express');
const {
  getMenu,
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
} = require('../controllers/menuController');
const {
  authMiddleware,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMenu);

// Admin-only routes
router.post('/', authMiddleware, requireAdmin, createMenuItem);
router.delete('/:id', authMiddleware, requireAdmin, deleteMenuItem);
router.put('/:id', authMiddleware, requireAdmin, updateMenuItem);

module.exports = router;
