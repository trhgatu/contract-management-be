'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        static associate(models) {
            // Audit log belongs to a user
            AuditLog.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }

    AuditLog.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        screen: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Screen/Feature name (e.g., Quản lý hợp đồng)'
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Action performed (THÊM, SỬA, XÓA, LOGIN, LOGOUT, etc.)'
        },
        details: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Changed data or action details'
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['screen']
            },
            {
                fields: ['action']
            },
            {
                fields: ['createdAt']
            }
        ]
    });

    return AuditLog;
};
