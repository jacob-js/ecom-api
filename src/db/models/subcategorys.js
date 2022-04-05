'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubCategorys.belongsTo(models.Categorys, { as: 'Category', foreignKey: 'categId', onDelete: 'CASCADE' });
    }
  };
  SubCategorys.init({
    name: DataTypes.STRING,
    categId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubCategorys',
  });
  return SubCategorys;
};