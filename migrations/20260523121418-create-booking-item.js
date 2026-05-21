'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Booking_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      booking_id: {
        type: Sequelize.BIGINT
      },
      vehicle_unit_id: {
        type: Sequelize.BIGINT
      },
      price_per_day: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      subtotal: {
        type: Sequelize.INTEGER
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

    await queryInterface.addConstraint("Booking_items", {
      fields: ['booking_id'],
      type: 'foreign key',
      name: "fk_custom_booking_items_booking_id",
      references: {
        table: "Bookings",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    
    await queryInterface.addConstraint("Booking_items", {
      fields: ['vehicle_unit_id'],
      type: 'foreign key',
      name: "fk_booking_items_vehicle_unit_id",
      references: {
        table: "Vehicle_units",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Booking_items');
  }
};