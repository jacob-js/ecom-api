'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Categorys', 'pk', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      }),
      queryInterface.addColumn('SubCategorys', 'pk', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      }),
      queryInterface.addColumn('ProductsTypes', 'pk', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Categorys', 'pk'),
      queryInterface.removeColumn('SubCategorys', 'pk'),
      queryInterface.removeColumn('ProductsTypes', 'pk')
    ])
  }
};
