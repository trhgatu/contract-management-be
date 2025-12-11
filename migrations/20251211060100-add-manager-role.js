'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add 'manager' to the role enum
        await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'manager';
    `);
    },

    down: async (queryInterface, Sequelize) => {
        // Cannot remove enum value in PostgreSQL easily
        // This would require recreating the enum and updating all references
        console.log('Cannot easily remove enum value. Manual intervention required if rollback needed.');
    }
};
