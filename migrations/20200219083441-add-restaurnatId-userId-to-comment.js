'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Comments', 'RestaurantId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Restaurants',
        key: 'id'
      }
    })
    return queryInterface.addColumn('Comments', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Users',
        key: 'id'
      }
    })

  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Comments', 'RestaurantId')
    return queryInterface.removeColumn('Comments', 'UserId')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
