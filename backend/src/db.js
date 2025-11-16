const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default menu items if none exist
    await seedDefaultMenu();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDefaultMenu = async () => {
  try {
    const count = await FoodItem.countDocuments();
    if (count > 0) {
      return; // already have items, do nothing
    }

    console.log('Seeding default menu items...');

    const defaultItems = [
      {
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty, melted cheese, lettuce, tomato, and our secret sauce.',
        price: 9.99,
        category: 'Burgers',
        imageUrl: '/images/cheeseburger.jpg',
      },
      {
        name: 'Margherita Pizza',
        description: 'Thin crust pizza with fresh mozzarella, basil, and tomato sauce.',
        price: 12.99,
        category: 'Pizza',
        imageUrl: '/images/margherita-pizza.jpg',
      },
      {
        name: 'Grilled Chicken Salad',
        description: 'Mixed greens with grilled chicken, cherry tomatoes, cucumbers, and vinaigrette.',
        price: 10.49,
        category: 'Salads',
        imageUrl: '/images/grilled-chicken-salad.jpg',
      },
      {
        name: 'Spaghetti Bolognese',
        description: 'Pasta in a rich beef and tomato sauce topped with parmesan.',
        price: 11.99,
        category: 'Pasta',
        imageUrl: '/images/spaghetti-bolognese.jpg',
      },
      {
        name: 'Crispy Fries',
        description: 'Golden, crispy French fries with a side of ketchup.',
        price: 3.99,
        category: 'Sides',
        imageUrl: '/images/fries.jpg',
      },
      {
        name: 'Chocolate Milkshake',
        description: 'Creamy chocolate milkshake topped with whipped cream.',
        price: 4.99,
        category: 'Drinks',
        imageUrl: '/images/chocolate-milkshake.jpg',
      },
    ];

    await FoodItem.insertMany(defaultItems);
    console.log('Default menu items seeded.');
  } catch (err) {
    console.error('Error seeding default menu:', err.message);
  }
};

module.exports = connectDB;
