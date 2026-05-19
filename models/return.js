'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Return extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Return.belongsTo(models.Booking, {
        foreignKey: "booking_id"
      })
    }
  }
  Return.init({
    booking_id: DataTypes.BIGINT,
    returned_at: DataTypes.DATE,
    late_fee: DataTypes.INTEGER,
    damage_fee: DataTypes.INTEGER,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Return',
  });
  return Return;
};