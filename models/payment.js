'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Booking, {
        foreignKey: "booking_id"
      })
    }
  }
  Payment.init({
    booking_id: DataTypes.BIGINT,
    method: DataTypes.ENUM('cash', 'online_payment'),
    payment_type: DataTypes.ENUM('dp', 'settlement', 'full_payment', 'refund'),
    amount: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'paid', 'failed'),
    paid_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};