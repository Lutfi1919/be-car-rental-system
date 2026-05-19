'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Returns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      booking_id: {
        type: Sequelize.BIGINT
      },
      returned_at: {
        type: Sequelize.DATE
      },
      late_fee: {
        type: Sequelize.INTEGER
      },
      damage_fee: {
        type: Sequelize.INTEGER
      },
      notes: {
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

    await queryInterface.addConstraint("Returns", {
      fields: ['booking_id'],
      type: 'foreign key',
      name: "fk_returns_booking_id",
      references: {
        table: "Bookings",
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Returns');
  }
};