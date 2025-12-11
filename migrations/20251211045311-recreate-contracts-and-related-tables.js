'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop old Contracts table if exists
    await queryInterface.dropTable('Contracts', { cascade: true }).catch(() => { });

    // Create new Contracts table with updated schema
    await queryInterface.createTable('Contracts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      signDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'master_data_customers',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contractTypeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'master_data_contract_types',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      valuePreVat: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      vat: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      valuePostVat: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      statusId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'master_data_status',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      acceptanceDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

    // Create ContractSoftware junction table for many-to-many
    await queryInterface.createTable('ContractSoftware', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      softwareId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'master_data_software',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    // Create payment_terms table
    await queryInterface.createTable('payment_terms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      batch: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ratio: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      value: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      isCollected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      collectionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      invoiceStatus: {
        type: Sequelize.ENUM('exported', 'not_exported'),
        defaultValue: 'not_exported',
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

    // Create expenses table
    await queryInterface.createTable('expenses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      category: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      supplierId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'master_data_suppliers',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      totalAmount: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      contractStatus: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'unpaid'),
        defaultValue: 'unpaid',
        allowNull: false
      },
      pic: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
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

    // Create project_members table
    await queryInterface.createTable('project_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      memberCode: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      role: {
        type: Sequelize.STRING(100),
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

    // Create contract_attachments table
    await queryInterface.createTable('contract_attachments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      size: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      uploadDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      filePath: {
        type: Sequelize.STRING(500),
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
    await queryInterface.dropTable('contract_attachments');
    await queryInterface.dropTable('project_members');
    await queryInterface.dropTable('expenses');
    await queryInterface.dropTable('payment_terms');
    await queryInterface.dropTable('ContractSoftware');
    await queryInterface.dropTable('Contracts');
  }
};
