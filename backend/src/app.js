const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const workerRoutes = require('./routes/workerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/payments', paymentRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Shawarma Hub API is running' });
});

module.exports = app;
