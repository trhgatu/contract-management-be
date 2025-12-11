'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterDataCustomer extends Model {
        static associate(models) {
            // A Customer has many Contracts
            MasterDataCustomer.hasMany(models.Contract, {
                foreignKey: 'customerId',
                as: 'contracts'
            });
        }
    }

    MasterDataCustomer.init({
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
            comment: 'Lĩnh vực hoạt động'
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
        taxCode: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        group: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Nhóm khách hàng: VIP, Thân thiết, Nội bộ, etc.'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MasterDataCustomer',
        tableName: 'master_data_customers',
        timestamps: true
    });

    return MasterDataCustomer;
};
