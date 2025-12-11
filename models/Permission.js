'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            // Permission belongs to a group
            Permission.belongsTo(models.UserGroup, {
                foreignKey: 'groupId',
                as: 'group'
            });
        }
    }

    Permission.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user_groups',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Permission name (e.g., Dashboard, Contracts, Master Data)'
        },
        isParent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Is this a parent permission (has children)'
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Parent permission ID if this is a child'
        },
        canView: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAdd: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEdit: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions'
    });

    return Permission;
};
