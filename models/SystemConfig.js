'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SystemConfig extends Model {
        static associate(models) {
            // No associations needed
        }
    }

    SystemConfig.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Configuration key (e.g., system_name, logo_url, etc.)'
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Configuration value'
        },
        type: {
            type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
            defaultValue: 'string',
            comment: 'Value data type'
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Config category for grouping'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isEditable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Can this config be edited via UI'
        }
    }, {
        sequelize,
        modelName: 'SystemConfig',
        tableName: 'system_configs'
    });

    return SystemConfig;
};
