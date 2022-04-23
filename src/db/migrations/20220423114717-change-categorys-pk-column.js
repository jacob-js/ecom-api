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
      }),
      queryInterface.removeColumn('Categorys', 'typeId'),
      queryInterface.removeColumn('SubCategorys', 'categId'),
      queryInterface.addColumn('Categorys', 'typeId', {
        type: Sequelize.UUID
      }),
      queryInterface.addColumn('SubCategorys', 'categId', {
        type: Sequelize.UUID
      }),

      queryInterface.removeColumn('Products', 'categoryId'),
      queryInterface.addColumn('Products', 'categoryId', {
        type: Sequelize.UUID
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Categorys', 'pk'),
      queryInterface.removeColumn('SubCategorys', 'pk'),
      queryInterface.removeColumn('ProductsTypes', 'pk'),
      queryInterface.removeColumn('Categorys', 'typeId'),
      queryInterface.removeColumn('SubCategorys', 'categId'),
      queryInterface.addColumn('Categorys', 'typeId', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('SubCategorys', 'categId', {
        type: Sequelize.INTEGER
      }),

      queryInterface.removeColumn('Products', 'categoryId'),
      queryInterface.addColumn('Products', 'categoryId', {
        type: Sequelize.INTEGER
      })
    ])
  }
};
