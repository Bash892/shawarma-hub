const FoodItem = require('../models/FoodItem');

// GET /api/menu
const getMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({ isAvailable: true });
    
    // Define category order: Shawarma, Desserts, Salads, Sides, Drinks
    const categoryOrder = {
      'Shawarma': 1,
      'Desserts': 2,
      'Salads': 3,
      'Sides': 4,
      'Drinks': 5,
    };
    
    // Sort items by category order, then by name within each category
    items.sort((a, b) => {
      const orderA = categoryOrder[a.category] || 999;
      const orderB = categoryOrder[b.category] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return a.name.localeCompare(b.name);
    });
    
    res.json(items);
  } catch (error) {
    console.error('getMenu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/menu  (admin)
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, isAvailable } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const item = await FoodItem.create({
      name,
      description,
      price,
      imageUrl,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('createMenuItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/menu/:id  (admin)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('deleteMenuItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/menu/:id  (admin)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FoodItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error('updateMenuItem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMenu,
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
};
