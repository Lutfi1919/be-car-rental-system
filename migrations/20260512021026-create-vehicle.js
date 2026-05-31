'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM('sedan', 'hatchback', 'coupe', 'sport', 'LCGC', 'SUV', 'MPV')
      },
      transmission: {
        type: Sequelize.ENUM('manual', 'automatic')
      },
      passengers: {
        type: Sequelize.INTEGER
      },
      fuel_type: {
        type: Sequelize.ENUM('pertalite', 'pertamax', 'pertamax_turbo', 'diesel', 'electric')
      },
      price_per_day: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      plate_number: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('available', 'maintenance')
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};