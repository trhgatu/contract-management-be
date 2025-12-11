'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warnings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(
          'acceptance_upcoming',
          'acceptance_overdue',
          'payment_upcoming',
          'payment_overdue',
          'contract_expired'
        ),
        allowNull: false
      },
      contractId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Contracts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      contractCode: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      customerName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      daysDiff: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0
      },
      pic: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'resolved'),
        defaultValue: 'pending',
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      details: {
        type: Sequelize.STRING(255),
        allowNull: true
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
    await queryInterface.dropTable('warnings');
  }
};
