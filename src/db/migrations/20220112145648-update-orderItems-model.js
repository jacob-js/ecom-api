'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('OrderItems', 'unitAmount', {
        type: Sequelize.DOUBLE
      }),
      queryInterface.addColumn('OrderItems', 'currency', {
        type: Sequelize.STRING
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('OrderItems', 'unitAmount'),
      queryInterface.removeColumn('OrderItems', 'currency')
    ])
  }
};
