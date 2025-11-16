const express = require('express');
const {
  getWorkers,
  createWorker,
  deleteWorker,
} = require('../controllers/workerController');
const {
  authMiddleware,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, getWorkers);
router.post('/', authMiddleware, requireAdmin, createWorker);
router.delete('/:id', authMiddleware, requireAdmin, deleteWorker);

module.exports = router;
