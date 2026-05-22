'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Verification, {
        foreignKey: "user_id"
      })
      
      User.hasMany(models.Booking, {
        foreignKey: "user_id"
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNum: DataTypes.STRING,
    profile_image: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('profile_image');
        return rawValue ? `http://localhost:4000/uploads/${rawValue}` : null;
      }
    },
    is_verified: { 
      type: DataTypes.ENUM('unverified', 'verified', 'rejected'),
      defaultValue: 'unverified'
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};