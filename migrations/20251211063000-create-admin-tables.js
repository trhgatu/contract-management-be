'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create user_groups table
        await queryInterface.createTable('user_groups', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            note: {
                type: Sequelize.TEXT,
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

        // 2. Add groupId to Users table
        await queryInterface.addColumn('Users', 'groupId', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'user_groups',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // 3. Create permissions table
        await queryInterface.createTable('permissions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            groupId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'user_groups',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            isParent: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            parentId: {
                type: Sequelize.UUID,
                allowNull: true
            },
            canView: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            canAdd: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            canEdit: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            canDelete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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

        // 4. Create audit_logs table
        await queryInterface.createTable('audit_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            screen: {
                type: Sequelize.STRING,
                allowNull: false
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            details: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            ipAddress: {
                type: Sequelize.STRING,
                allowNull: true
            },
            userAgent: {
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

        // 5. Create system_configs table
        await queryInterface.createTable('system_configs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            key: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            value: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            type: {
                type: Sequelize.ENUM('string', 'number', 'boolean', 'json'),
                defaultValue: 'string'
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            isEditable: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
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

        // Add indexes
        await queryInterface.addIndex('audit_logs', ['userId']);
        await queryInterface.addIndex('audit_logs', ['screen']);
        await queryInterface.addIndex('audit_logs', ['action']);
        await queryInterface.addIndex('audit_logs', ['createdAt']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('audit_logs');
        await queryInterface.dropTable('permissions');
        await queryInterface.removeColumn('Users', 'groupId');
        await queryInterface.dropTable('user_groups');
        await queryInterface.dropTable('system_configs');
    }
};
