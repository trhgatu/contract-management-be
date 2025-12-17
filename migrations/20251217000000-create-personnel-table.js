'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('master_data_personnel', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: 'Chức vụ / Vai trò'
            },
            group: {
                type: Sequelize.STRING(100),
                allowNull: true,
                comment: 'Phòng ban'
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                defaultValue: 'active',
                allowNull: false
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
        await queryInterface.dropTable('master_data_personnel');
    }
};
