'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const personnel = [
            {
                id: uuidv4(),
                code: 'EMP001',
                name: 'Nguyễn Văn A',
                description: 'Project Manager',
                group: 'Khối Phát triển PM',
                email: 'nguyenvana@example.com',
                phone: '0901234567',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                code: 'EMP002',
                name: 'Trần Thị B',
                description: 'Developer',
                group: 'Khối Phát triển PM',
                email: 'tranthib@example.com',
                phone: '0901234568',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                code: 'EMP003',
                name: 'Lê Văn C',
                description: 'Tester',
                group: 'Khối Đảm bảo chất lượng',
                email: 'levanc@example.com',
                phone: '0901234569',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('master_data_personnel', personnel, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('master_data_personnel', null, {});
    }
};
