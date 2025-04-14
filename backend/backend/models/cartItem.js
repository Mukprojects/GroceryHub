'use strict';

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  });

  CartItem.associate = function(models) {
    // CartItem belongs to a cart
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cartId',
      as: 'cart'
    });
    
    // CartItem belongs to a product
    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return CartItem;
}; 