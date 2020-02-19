'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT,
    RestaurantId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Restaurant)
    Comment.belongsTo(models.User)
    // associations can be defined here
  };
  return Comment;
};