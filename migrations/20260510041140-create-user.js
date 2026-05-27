'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phoneNum: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING,
        defaultValue: '/images/default-pfp.jpg'
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
      },
      is_verified: {
        type: Sequelize.ENUM('unverified', 'pending', 'verified', 'rejected'),
        defaultValue: 'unverified'
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
    await queryInterface.dropTable('Users');
  }
};