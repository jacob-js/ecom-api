'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItems.belongsTo(models.Orders, { as: 'Order', foreignKey: 'orderId' });
      OrderItems.belongsTo(models.Products, { as: 'Product', foreignKey: 'productId' });
    }
  };
  OrderItems.init({
    productId: DataTypes.UUID,
    quantity: DataTypes.DOUBLE,
    specifications: DataTypes.ARRAY(DataTypes.JSON),
    orderId: DataTypes.UUID,
    unitAmount: DataTypes.DOUBLE,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderItems',
  });
  return OrderItems;
};