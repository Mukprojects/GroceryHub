'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,  // Store array of image URLs as JSON
      allowNull: true,
      defaultValue: []
    },
    countInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0
    },
    numReviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model3d: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Product.associate = function(models) {
    // Product belongs to a category
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    // Product has many reviews
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      as: 'reviews'
    });
    
    // Product belongs to many orders through OrderItem
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'productId',
      otherKey: 'orderId',
      as: 'orders'
    });
    
    // Product belongs to many carts through CartItem
    Product.belongsToMany(models.Cart, {
      through: models.CartItem,
      foreignKey: 'productId',
      otherKey: 'cartId',
      as: 'carts'
    });
  };

  return Product;
}; 