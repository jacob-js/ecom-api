'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Products', 'isBest', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.changeColumn('Products', 'description', {
        type: Sequelize.TEXT
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Products', 'isBest'),
      queryInterface.changeColumn('Products', 'description', {
        type: Sequelize.STRING
      })
    ]);
  }
};
