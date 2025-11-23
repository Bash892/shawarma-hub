require('dotenv').config();
const mongoose = require('mongoose');
const FoodItem = require('./src/models/FoodItem');

const resetAndSeedMenu = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear all existing menu items
    const deleteResult = await FoodItem.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing menu items`);

    // Seed new Shawarma Hub menu items
    const menuItems = [
      // Shawarma Wraps
      {
        name: 'Classic Chicken Shawarma Wrap',
        description: 'Tender marinated chicken, fresh vegetables, tahini sauce, and pickles wrapped in warm pita bread.',
        price: 8.99,
        category: 'Shawarma',
        imageUrl: '/images/chicken-shawarma.jpg',
      },
      {
        name: 'Beef Shawarma Wrap',
        description: 'Spiced beef shawarma with onions, tomatoes, parsley, and garlic sauce in a fresh pita wrap.',
        price: 9.99,
        category: 'Shawarma',
        imageUrl: '/images/beef-shawarma.jpg',
      },
      {
        name: 'Lamb Shawarma Wrap',
        description: 'Premium lamb shawarma with mixed vegetables, tahini, and our signature hot sauce.',
        price: 11.99,
        category: 'Shawarma',
        imageUrl: '/images/lamb-shawarma.jpg',
      },
      {
        name: 'Mixed Shawarma Wrap',
        description: 'Combination of chicken and beef shawarma with all the fixings in one delicious wrap.',
        price: 10.99,
        category: 'Shawarma',
        imageUrl: '/images/mixed-shawarma.jpg',
      },
      {
        name: 'Falafel Wrap',
        description: 'Crispy falafel balls with fresh vegetables, hummus, and tahini sauce. Vegetarian option.',
        price: 7.99,
        category: 'Shawarma',
        imageUrl: '/images/falafel-wrap.jpg',
      },
      {
        name: 'Chicken Shawarma Plate',
        description: 'Chicken shawarma served over basmati rice with hummus, salad, pickles, and pita bread.',
        price: 12.99,
        category: 'Shawarma',
        imageUrl: '/images/chicken-plate.jpg',
      },
      {
        name: 'Beef Shawarma Plate',
        description: 'Beef shawarma with rice, garlic sauce, fresh salad, and warm pita on the side.',
        price: 13.99,
        category: 'Shawarma',
        imageUrl: '/images/beef-plate.jpg',
      },
      
      // Sides
      {
        name: 'Crispy French Fries',
        description: 'Golden, crispy French fries seasoned with Mediterranean spices. Served with ketchup.',
        price: 3.99,
        category: 'Sides',
        imageUrl: '/images/fries.jpg',
      },
      {
        name: 'Hummus & Pita',
        description: 'Creamy homemade hummus served with warm pita bread. Perfect starter or side.',
        price: 4.99,
        category: 'Sides',
        imageUrl: '/images/hummus.jpg',
      },
      {
        name: 'Baba Ganoush',
        description: 'Smoky roasted eggplant dip with tahini, lemon, and garlic. Served with pita.',
        price: 5.49,
        category: 'Sides',
        imageUrl: '/images/baba-ganoush.jpg',
      },
      {
        name: 'Fattoush Salad',
        description: 'Fresh mixed greens with tomatoes, cucumbers, radish, and crispy pita chips.',
        price: 6.99,
        category: 'Salads',
        imageUrl: '/images/fattoush-salad.jpg',
      },
      {
        name: 'Tabbouleh',
        description: 'Fresh parsley salad with bulgur, tomatoes, mint, and lemon dressing.',
        price: 5.99,
        category: 'Salads',
        imageUrl: '/images/tabbouleh.jpg',
      },
      
      // Drinks
      {
        name: 'Fresh Lemonade',
        description: 'Freshly squeezed lemonade with mint. Refreshing and tangy.',
        price: 3.49,
        category: 'Drinks',
        imageUrl: '/images/lemonade.jpg',
      },
      {
        name: 'Mint Tea',
        description: 'Traditional hot mint tea. Perfect to complement your meal.',
        price: 2.99,
        category: 'Drinks',
        imageUrl: '/images/mint-tea.jpg',
      },
      {
        name: 'Ayran',
        description: 'Traditional yogurt drink with salt. Cool and refreshing.',
        price: 3.99,
        category: 'Drinks',
        imageUrl: '/images/ayran.jpg',
      },
      {
        name: 'Turkish Coffee',
        description: 'Strong, aromatic Turkish coffee served in traditional style.',
        price: 4.49,
        category: 'Drinks',
        imageUrl: '/images/turkish-coffee.jpg',
      },
      
      // Desserts
      {
        name: 'Baklava',
        description: 'Sweet pastry made of layers of filo filled with chopped nuts and honey syrup.',
        price: 4.99,
        category: 'Desserts',
        imageUrl: '/images/baklava.jpg',
      },
      {
        name: 'Kunafa',
        description: 'Sweet cheese pastry soaked in sweet syrup. A Middle Eastern favorite.',
        price: 5.99,
        category: 'Desserts',
        imageUrl: '/images/kunafa.jpg',
      },
    ];

    const result = await FoodItem.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${result.length} Shawarma Hub menu items!`);
    console.log('\nMenu Categories:');
    const categories = [...new Set(menuItems.map(item => item.category))];
    categories.forEach(cat => {
      const count = menuItems.filter(item => item.category === cat).length;
      console.log(`  - ${cat}: ${count} items`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting menu:', error);
    process.exit(1);
  }
};

resetAndSeedMenu();

