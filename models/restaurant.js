'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {});
  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.Category)
    Restaurnat.hasMany(models.Comment)
    // associations can be defined here
  };
  return Restaurant;
};