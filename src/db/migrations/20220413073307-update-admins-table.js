'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Admins', 'role', {
        type: Sequelize.STRING,
        required: true
      }),
      queryInterface.addColumn('Admins', 'permissions', {
        type: Sequelize.ARRAY(Sequelize.STRING),
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Admins', 'role'),
      queryInterface.removeColumn('Admins', 'permissions')
    ]);
  }
};
