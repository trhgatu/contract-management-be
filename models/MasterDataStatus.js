'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataStatus extends Model {
        static associate(models) {
            // A Status has many Contracts
            MasterDataStatus.hasMany(models.Contract, {
                foreignKey: 'statusId',
                as: 'contracts'
            });
        }
    }

    MasterDataStatus.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'ST01, ST02, ST03, etc.'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Chưa thực hiện, Đang triển khai, Hoàn thành'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Tailwind CSS classes: bg-blue-100 text-blue-600'
        }
    }, {
        sequelize,
        modelName: 'MasterDataStatus',
        tableName: 'master_data_status',
        timestamps: true
    });

    return MasterDataStatus;
};
