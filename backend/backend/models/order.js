'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentResult: {
      type: DataTypes.JSON,
      allowNull: true
    },
    taxPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    shippingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    }
  });

  Order.associate = function(models) {
    // Order belongs to a user
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    // Order has many order items
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems'
    });
    
    // Order belongs to many products through OrderItem
    Order.belongsToMany(models.Product, {
      through: models.OrderItem,
      foreignKey: 'orderId',
      otherKey: 'productId',
      as: 'products'
    });
  };

  return Order;
}; 