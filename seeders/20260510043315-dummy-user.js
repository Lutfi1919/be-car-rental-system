'use strict';
const passwordHash = require('password-hash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'lutfi',
        email: 'user1@gmail.com',
        password: passwordHash.generate('user111'),
        phoneNum: '087875221858',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
