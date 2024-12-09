// backend/seeders/YYYYMMDDHHMMSS-demo-users.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'customer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Staff',
        lastName: 'User',
        email: 'staff@example.com',
        password: hashedPassword,
        role: 'staff',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};