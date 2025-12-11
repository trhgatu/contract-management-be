'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataSupplier extends Model {
        static associate(models) {
            // A Supplier has many Expenses
            MasterDataSupplier.hasMany(models.Expense, {
                foreignKey: 'supplierId',
                as: 'expenses'
            });
        }
    }

    MasterDataSupplier.init({
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
        field: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Lĩnh vực cung cấp'
        },
        taxCode: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        contactPerson: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        address: {
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
        modelName: 'MasterDataSupplier',
        tableName: 'master_data_suppliers',
        timestamps: true
    });

    return MasterDataSupplier;
};
