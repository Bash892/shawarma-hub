const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, // in dollars
    imageUrl: { type: String },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
