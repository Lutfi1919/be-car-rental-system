'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'is_verified', {
      type: Sequelize.ENUM('unverified', 'verified', 'rejected'),
      defaultValue: 'unverified',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_verified');
  }
};
