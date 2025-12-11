'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataSoftware extends Model {
        static associate(models) {
            // Software belongs to many Contracts (many-to-many)
            MasterDataSoftware.belongsToMany(models.Contract, {
                through: 'ContractSoftware',
                foreignKey: 'softwareId',
                otherKey: 'contractId',
                as: 'contracts'
            });
        }
    }

    MasterDataSoftware.init({
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
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Tên phần mềm: VTOS, VSL, CAS, etc.'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'MasterDataSoftware',
        tableName: 'master_data_software',
        timestamps: true
    });

    return MasterDataSoftware;
};
