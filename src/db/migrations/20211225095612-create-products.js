'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      cover: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      manufacturer: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.DOUBLE
      },
      quantityMetric: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      currency: {
        type: Sequelize.STRING
      },
      specifications: {
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      owner: {
        type: Sequelize.UUID
      },
      isNew: {
        type: Sequelize.BOOLEAN
      },
      discount: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};