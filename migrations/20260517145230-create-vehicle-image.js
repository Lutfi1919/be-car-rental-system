'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicle_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      vehicle_unit_id: {
        type: Sequelize.BIGINT
      },
      vehicle_images: {
        type: Sequelize.STRING
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
      fields: ['vehicle_unit_id'],
      type: 'foreign key',
      name: "fk_vehicle_images_vehicle_unit_id",
      references: {
        table: "Vehicle_units",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicle_images');
  }
};