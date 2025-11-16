const Order = require('../models/Order');

// GET /api/orders/my   (user)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.foodItem')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders       (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.foodItem')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/orders/:id/status   (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // allowed states – you can adjust if you only want 3
    const allowedStatuses = ['pending', 'preparing', 'delivered', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.foodItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
