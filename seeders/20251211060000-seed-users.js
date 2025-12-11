'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const salt = await bcrypt.genSalt(10);

        const users = [
            {
                id: uuidv4(),
                name: 'Admin User',
                email: 'admin@ceh.vn',
                password: await bcrypt.hash('Admin@123', salt),
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Manager User',
                email: 'manager@ceh.vn',
                password: await bcrypt.hash('Manager@123', salt),
                role: 'manager',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Regular User',
                email: 'user@ceh.vn',
                password: await bcrypt.hash('User@123', salt),
                role: 'user',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', {
            email: {
                [Sequelize.Op.in]: ['admin@ceh.vn', 'manager@ceh.vn', 'user@ceh.vn']
            }
        }, {});
    }
};
