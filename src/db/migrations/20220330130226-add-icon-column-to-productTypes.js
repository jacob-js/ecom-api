'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ProductsTypes', 'icon', {
        type: Sequelize.STRING,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ProductsTypes', 'icon')
    ])
  }
};
