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
      Products.hasMany(models.ProductColors, { as: 'Colors', foreignKey: 'productId' });
    }
  };
  Products.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    cover: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    manufacturer: DataTypes.STRING,
    quantity: DataTypes.DOUBLE,
    quantityMetric: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    specifications: DataTypes.ARRAY(DataTypes.JSON),
    owner: DataTypes.UUID,
    isNew: DataTypes.BOOLEAN,
    discount: DataTypes.DOUBLE,
    isBest: DataTypes.BOOLEAN,
    sizes: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};