'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.createTable('ProductsTypes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),
      await queryInterface.addColumn('Categorys', 'typeId', {
        type: Sequelize.INTEGER,
      })
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.dropTable('ProductsTypes'),
      await queryInterface.removeColumn('Categorys', 'typeId')
    ])
  }
};