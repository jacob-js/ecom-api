'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Products', 'isBest', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Products', 'isBest')
    ]);
  }
};
