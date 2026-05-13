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
      
      Booking.hasMany(models.Booking_item, {
        foreignKey: "booking_id"
      })
    }
  }
  Booking.init({
    user_id: DataTypes.BIGINT,
    total_price: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'completed', 'canceled')
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};