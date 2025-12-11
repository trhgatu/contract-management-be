'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataUnit extends Model {
        static associate(models) {
            // Define association if needed in future
            // e.g., Unit hasMany Contracts
        }
    }

    MasterDataUnit.init({
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
            comment: 'DV01, DV02, DV03'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Đơn vị thực hiện: CEH Software, CEH Infrastructure, etc.'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'MasterDataUnit',
        tableName: 'master_data_units',
        timestamps: true
    });

    return MasterDataUnit;
};
