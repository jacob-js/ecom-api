'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Orders', 'isGift', {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn('Orders', 'receiverName', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Orders', 'receiverPhone', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Orders', 'giftMention', {
        type: Sequelize.STRING
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Orders', 'isGift'),
      queryInterface.removeColumn('Orders', 'receiverName'),
      queryInterface.removeColumn('Orders', 'receiverPhone'),
      queryInterface.removeColumn('Orders', 'giftMention')
    ])
  }
};
