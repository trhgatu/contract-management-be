'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataPersonnel extends Model {
        static associate(models) {
            // Define associations here if any
            // Example: MasterDataPersonnel.hasMany(models.Contract, { foreignKey: 'picId' });
        }
    }

    MasterDataPersonnel.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Chức vụ / Vai trò'
        },
        group: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Phòng ban'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MasterDataPersonnel',
        tableName: 'master_data_personnel',
        timestamps: true
    });

    return MasterDataPersonnel;
};
