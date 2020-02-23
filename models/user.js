'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Comment)
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedRestaurants'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikeRestaurants'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'FollowerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'FollowingId',
      as: 'Followers'
    })
    // associations can be defined here
  };
  return User;
};