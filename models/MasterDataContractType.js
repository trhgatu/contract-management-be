'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataContractType extends Model {
        static associate(models) {
            // A ContractType has many Contracts
            MasterDataContractType.hasMany(models.Contract, {
                foreignKey: 'contractTypeId',
                as: 'contracts'
            });
        }
    }

    MasterDataContractType.init({
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
            comment: 'HD01, HD02, HD03, HD04'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Triển khai mới, Bảo trì, Gia hạn, Mua sắm'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'MasterDataContractType',
        tableName: 'master_data_contract_types',
        timestamps: true
    });

    return MasterDataContractType;
};
