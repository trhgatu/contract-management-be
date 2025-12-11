'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Enable uuid-ossp extension for PostgreSQL UUID generation
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Add default value for ContractSoftware.id using database-level function
        await queryInterface.sequelize.query(`
      ALTER TABLE "ContractSoftware"
      ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
    `);
    },

    async down(queryInterface, Sequelize) {
        // Remove default value
        await queryInterface.sequelize.query(`
      ALTER TABLE "ContractSoftware"
      ALTER COLUMN "id" DROP DEFAULT;
    `);

        // Optionally drop extension (commented out to avoid affecting other tables)
        // await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
    }
};
