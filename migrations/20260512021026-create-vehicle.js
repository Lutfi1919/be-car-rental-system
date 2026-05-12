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
        type: Sequelize.ENUM('sedan', 'SUV', 'hatchback', 'coupe', 'sport')
      },
      transmission: {
        type: Sequelize.ENUM('manual', 'automatic')
      },
      stock: {
        type: Sequelize.INTEGER
      },
      price_per_day: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('available', 'unavailable')
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