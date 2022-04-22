'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Products', 'sales', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Products', 'deletedAt', {
        type: Sequelize.DATE
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Products', 'sales'),
      queryInterface.removeColumn('Products', 'deletedAt')
    ])
  }
};
