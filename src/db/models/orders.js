'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Orders.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ref: DataTypes.STRING,
    userId: DataTypes.UUID,
    status: DataTypes.STRING,
    phone: DataTypes.STRING,
    country: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    reductionId: DataTypes.UUID,
    additionnalInfo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};