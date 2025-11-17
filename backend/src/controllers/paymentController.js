const Stripe = require('stripe');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session  (user)
const createCheckoutSession = async (req, res) => {
  try {
    const { items, type, deliveryDetails } = req.body;
    // items: [{ foodItemId, quantity }]
    // type: 'delivery' | 'pickup'
    // deliveryDetails: { phone, address, notes, allergies } (for delivery)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!['delivery', 'pickup'].includes(type)) {
      return res.status(400).json({ message: 'Invalid order type' });
    }

    // (Optional) backend validation for delivery
    if (type === 'delivery') {
      if (
        !deliveryDetails ||
        !deliveryDetails.phone?.trim() ||
        !deliveryDetails.address?.trim()
      ) {
        return res
          .status(400)
          .json({ message: 'Phone number and address are required for delivery.' });
      }
    }

    // Fetch food items from DB to ensure prices are trusted
    const foodIds = items.map((i) => i.foodItemId);
    const foodItems = await FoodItem.find({ _id: { $in: foodIds } });

    const line_items = [];
    let totalAmount = 0;

    items.forEach((cartItem) => {
      const food = foodItems.find(
        (f) => f._id.toString() === cartItem.foodItemId
      );
      if (!food) return;

      const quantity = cartItem.quantity || 1;
      const unitAmountCents = Math.round(food.price * 100);

      totalAmount += food.price * quantity;

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: food.name,
          },
          unit_amount: unitAmountCents,
        },
        quantity,
      });
    });

    if (line_items.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    });

    // Create order as pending
    const order = await Order.create({
      user: req.user.id,
      items: items.map((i) => ({
        foodItem: i.foodItemId,
        quantity: i.quantity || 1,
      })),
      totalAmount,
      type,
      status: 'pending',
      stripeSessionId: session.id,

      // ✅ NEW: save delivery details only for delivery orders
      deliveryDetails:
        type === 'delivery'
          ? {
              phone: deliveryDetails?.phone || '',
              address: deliveryDetails?.address || '',
              notes: deliveryDetails?.notes || '',
              allergies: deliveryDetails?.allergies || '',
            }
          : undefined,
    });

    res.json({
      url: session.url,
      sessionId: session.id,
      orderId: order._id,
    });
  } catch (error) {
    console.error('createCheckoutSession error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/payments/webhook
// NOTE: For simplicity, this does NOT verify signature yet.
// In production, use stripe.webhooks.constructEvent with STRIPE_WEBHOOK_SECRET.
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.status = 'paid';
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('handleWebhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
