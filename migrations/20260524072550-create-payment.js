'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      booking_id: {
        type: Sequelize.BIGINT
      },
      method: {
        type: Sequelize.ENUM('cash', 'online_payment')
      },
      payment_type: {
        type: Sequelize.ENUM('dp', 'settlement', 'full_payment', 'additional_fee', 'refund')
      },
      amount: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
      },
      paid_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint("Payments", {
      fields: ['booking_id'],
      type: 'foreign key',
      name: "fk_payments_booking_id",
      references: {
        table: "Bookings",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};