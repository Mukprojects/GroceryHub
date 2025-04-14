'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  });

  Cart.associate = function(models) {
    // Cart belongs to a user
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    // Cart has many cart items
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'cartItems'
    });
    
    // Cart belongs to many products through CartItem
    Cart.belongsToMany(models.Product, {
      through: models.CartItem,
      foreignKey: 'cartId',
      otherKey: 'productId',
      as: 'products'
    });
  };

  return Cart;
}; 