const express = require('express');
const {
  createCheckoutSession,
  handleWebhook,
} = require('../controllers/paymentController');
const {
  authMiddleware,
  requireUser,
} = require('../middleware/authMiddleware');

const router = express.Router();

// User starts checkout
router.post('/create-checkout-session', authMiddleware, requireUser, createCheckoutSession);

// Stripe webhook (do NOT protect with auth; Stripe calls this)
router.post('/webhook', express.json({ type: 'application/json' }), handleWebhook);

module.exports = router;
