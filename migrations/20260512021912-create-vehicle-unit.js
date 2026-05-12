'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicle_units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      vehicle_id: {
        type: Sequelize.BIGINT
      },
      plate_number: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('available', 'on_rent', 'maintenance')
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

    await queryInterface.addConstraint("Vehicle_units", {
      fields: ['vehicle_id'],
      type: 'foreign key',
      name: 'fk_custom_vehicle_id',
      references: {
        table: 'Vehicles',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicle_units');
  }
};