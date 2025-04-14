'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Review.associate = function(models) {
    // Review belongs to a product
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    
    // Review belongs to a user
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Review;
}; 