'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate hash for default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Add demo users
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        phone: '1234567890',
        address: '123 Admin St, Admin City, AC 12345',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
        phone: '9876543210',
        address: '456 User St, User City, UC 67890',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Add demo categories
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        description: 'Fresh fruits and vegetables',
        image: '/uploads/categories/fruits-vegetables.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dairy & Bakery',
        slug: 'dairy-bakery',
        description: 'Dairy products and bakery items',
        image: '/uploads/categories/dairy-bakery.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Snacks & Beverages',
        slug: 'snacks-beverages',
        description: 'Snacks and beverages',
        image: '/uploads/categories/snacks-beverages.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get the inserted category IDs
    const categoriesData = await queryInterface.sequelize.query(
      `SELECT id, name FROM Categories`
    );
    
    // MySQL returns results differently than SQLite
    const categoryRows = categoriesData[0];
    
    // Get category IDs
    const fruitVegCategory = categoryRows.find(c => c.name === 'Fruits & Vegetables');
    const dairyBakeryCategory = categoryRows.find(c => c.name === 'Dairy & Bakery');
    const snacksBeveragesCategory = categoryRows.find(c => c.name === 'Snacks & Beverages');

    // Add demo products
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Fresh Apples',
        slug: 'fresh-apples',
        description: 'Fresh and juicy apples from local farms',
        price: 2.99,
        discountPrice: 2.49,
        image: '/uploads/products/apples.jpg',
        images: JSON.stringify(['/uploads/products/apples-1.jpg', '/uploads/products/apples-2.jpg']),
        countInStock: 50,
        averageRating: 4.5,
        numReviews: 12,
        featured: true,
        weight: '1 kg',
        dimensions: null,
        model3d: '/models/apple.glb',
        categoryId: fruitVegCategory ? fruitVegCategory.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Whole Milk',
        slug: 'whole-milk',
        description: 'Fresh whole milk from local dairy farms',
        price: 3.49,
        discountPrice: 0,
        image: '/uploads/products/milk.jpg',
        images: JSON.stringify(['/uploads/products/milk-1.jpg']),
        countInStock: 30,
        averageRating: 4.8,
        numReviews: 8,
        featured: true,
        weight: '1 liter',
        dimensions: null,
        model3d: '/models/milk.glb',
        categoryId: dairyBakeryCategory ? dairyBakeryCategory.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Potato Chips',
        slug: 'potato-chips',
        description: 'Crunchy potato chips with sea salt',
        price: 1.99,
        discountPrice: 1.79,
        image: '/uploads/products/chips.jpg',
        images: JSON.stringify(['/uploads/products/chips-1.jpg', '/uploads/products/chips-2.jpg']),
        countInStock: 100,
        averageRating: 4.2,
        numReviews: 15,
        featured: false,
        weight: '150g',
        dimensions: null,
        model3d: '/models/chips.glb',
        categoryId: snacksBeveragesCategory ? snacksBeveragesCategory.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seeded data in reverse order
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 