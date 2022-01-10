'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'sizes', {
      type: Sequelize.ARRAY(Sequelize.STRING),
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'sizes')
  }
};
