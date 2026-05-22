'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Verification.belongsTo(models.User, {
        foreignKey: "user_id"
      })
    }
  }
  Verification.init({
    user_id: DataTypes.BIGINT,
    ktp_image: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('ktp_image');
        return rawValue ? `http://localhost:4000/uploads/${rawValue}` : null;
      }
    },
    sim_image: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('sim_image');
        return rawValue ? `http://localhost:4000/uploads/${rawValue}` : null;
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Verification',
  });
  return Verification;
};