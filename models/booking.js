'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: "user_id"
      })

      Booking.belongsTo(models.Booking_package, {
        foreignKey: "booking_package_id"
      })
      
      Booking.hasMany(models.Booking_item, {
        foreignKey: "booking_id"
      })

      Booking.hasMany(models.Payment, {
        foreignKey: "booking_id"
      })

      Booking.hasOne(models.Return, {
        foreignKey: "booking_id"
      })
    }
  }
  Booking.init({
    booking_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_id: DataTypes.BIGINT,
    booking_package_id: DataTypes.BIGINT,
    total_price: DataTypes.INTEGER,
    paid_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remaining_payment: DataTypes.INTEGER,
    payment_status: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
    status: DataTypes.ENUM('pending', 'paid', 'completed', 'canceled'),
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};