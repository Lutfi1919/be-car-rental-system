'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking_package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking_package.hasMany(models.Booking, {
        foreignKey: "booking_package_id"
      })
    }
  }
  Booking_package.init({
    name: DataTypes.STRING,
    price_multiplier: DataTypes.FLOAT,
    can_refund_dp: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking_package',
  });
  return Booking_package;
};