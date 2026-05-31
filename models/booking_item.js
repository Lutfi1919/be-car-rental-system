'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking_item.belongsTo(models.Booking, {
        foreignKey: "booking_id"
      })
      
      Booking_item.belongsTo(models.Vehicle, {
        foreignKey: "vehicle_id"
      })
    }
  }
  Booking_item.init({
    booking_id: DataTypes.BIGINT,
    vehicle_id: DataTypes.BIGINT,
    price_per_day: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    subtotal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking_item',
  });
  return Booking_item;
};