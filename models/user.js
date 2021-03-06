'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    verificationCode: DataTypes.STRING,
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    retriesLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    lastRetryUsed: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
