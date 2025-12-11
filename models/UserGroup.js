'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserGroup extends Model {
        static associate(models) {
            // A group can have many users
            UserGroup.hasMany(models.User, {
                foreignKey: 'groupId',
                as: 'users'
            });

            // A group can have many permissions
            UserGroup.hasMany(models.Permission, {
                foreignKey: 'groupId',
                as: 'permissions'
            });
        }
    }

    UserGroup.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'UserGroup',
        tableName: 'user_groups'
    });

    return UserGroup;
};
