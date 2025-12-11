'use strict';
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto'); // Use built-in crypto module

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userId = randomUUID();

    await queryInterface.bulkInsert('Users', [{
      id: userId,
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};