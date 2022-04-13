'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admins.belongsTo(models.Users, { as: 'User', foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  };
  Admins.init({
    userId: DataTypes.UUID,
    role: DataTypes.STRING,
    permissions: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Admins',
  });
  return Admins;
};