'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Vehicle.init({
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('sedan', 'hatchback', 'coupe', 'sport', 'LCGC', 'SUV', 'MPV'),
    },
    transmission: {
      type: DataTypes.ENUM('manual', 'automatic')
    },
    passengers: DataTypes.INTEGER,
    fuel_type: {
      type: DataTypes.ENUM('pertalite', 'pertamax', 'pertamax_turbo', 'diesel', 'electric'),
    },
    price_per_day: DataTypes.INTEGER,
    description: DataTypes.STRING,
    plate_number: DataTypes.STRING,
    image: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('image');
        return rawValue ? `http://localhost:4000/uploads/${rawValue}` : null;
      }
    },
    status: {
      type: DataTypes.ENUM('available', 'maintenance')
    },
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};