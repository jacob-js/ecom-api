'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductsTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductsTypes.hasMany(models.Categorys, { as: 'Categorys', foreignKey: 'typeId' });
    }
  };
  ProductsTypes.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductsTypes',
  });
  return ProductsTypes;
};