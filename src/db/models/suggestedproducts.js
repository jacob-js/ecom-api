'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuggestedProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SuggestedProducts.belongsTo(models.Users, { as: 'User', foreignKey: 'userId' });
    }
  };
  SuggestedProducts.init({
    username: DataTypes.STRING,
    userphone: DataTypes.STRING,
    userId: DataTypes.UUID,
    productName: DataTypes.STRING,
    productDescript: DataTypes.TEXT,
    cover: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SuggestedProducts',
  });
  return SuggestedProducts;
};