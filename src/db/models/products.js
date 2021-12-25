'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Products.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    cover: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    manufacturer: DataTypes.STRING,
    quantity: DataTypes.DOUBLE,
    price: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    specifications: DataTypes.ARRAY(DataTypes.JSON),
    owner: DataTypes.UUID,
    isNew: DataTypes.BOOLEAN,
    discount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};