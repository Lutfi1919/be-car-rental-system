'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle_unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vehicle_unit.belongsTo(models.Vehicle, {
        foreignKey: "vehicle_id"
      })

      Vehicle_unit.hasOne(models.Vehicle_image, {
        foreignKey: "vehicle_unit_id"
      })
    }
  }
  Vehicle_unit.init({
    vehicle_id: DataTypes.BIGINT,
    plate_number: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('available', 'on_rent', 'maintenance')
    }
  }, {
    sequelize,
    modelName: 'Vehicle_unit',
  });
  return Vehicle_unit;
};