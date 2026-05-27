'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      booking_package_id: {
        type: Sequelize.BIGINT
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      remaining_payment: {
        type: Sequelize.INTEGER
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid', 'dp_paid', 'paid')
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'on_rent', 'completed', 'canceled')
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

    await queryInterface.addConstraint("Bookings", {
      fields: ['user_id'],
      type: 'foreign key',
      name: "fk_bookings_user_id",
      references: {
        table: "Users",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint("Bookings", {
      fields: ['booking_package_id'],
      type: 'foreign key',
      name: "fk_bookings_booking_package_id",
      references: {
        table: "Booking_packages",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};