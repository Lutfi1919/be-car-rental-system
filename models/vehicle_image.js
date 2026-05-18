'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle_image.belongsTo(models.Vehicle_unit, {
        foreignKey: "vehicle_unit_id"
      })
    }
  }
  Vehicle_image.init({
    vehicle_unit_id: DataTypes.BIGINT,
    vehicle_images: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('vehicle_images');
        return rawValue ? `http://localhost:3000/uploads/${rawValue}` : null;
      }
    }
  }, {
    sequelize,
    modelName: 'Vehicle_image',
  });
  return Vehicle_image;
};