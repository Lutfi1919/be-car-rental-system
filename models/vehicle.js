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
      Vehicle.hasMany(models.Vehicle_unit, {
        foreignKey: "vehicle_id"
      })
    }
  }
  Vehicle.init({
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('Sedan', 'SUV', 'Hatchback', 'Coupe', 'Sport'),
    },
    transmission: {
      type: DataTypes.ENUM('Manual', 'Automatic')
    },
    stock: DataTypes.INTEGER,
    price_per_day: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Available', 'Unavailable')
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};