'use strict';
module.exports = (sequelize, DataTypes) => {
  const Res = sequelize.define('Res', {
    name: DataTypes.STRING
  }, {});
  Res.associate = function(models) {
    // associations can be defined here
  };
  return Res;
};