'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Categorys.belongsTo(models.ProductsTypes, { as: 'ParentCateg', foreignKey: 'typeId', onDelete: 'CASCADE' });
      Categorys.hasMany(models.SubCategorys, { as: 'SubCategorys', foreignKey: 'categId', onDelete: 'CASCADE' });
    }
  };
  Categorys.init({
    pk: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    cover: DataTypes.STRING,
    isTop: DataTypes.BOOLEAN,
    typeId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Categorys',
  });
  return Categorys;
};