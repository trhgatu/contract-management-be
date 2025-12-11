'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Expense extends Model {
        static associate(models) {
            // An Expense belongs to a Contract
            Expense.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                as: 'contract'
            });

            // An Expense belongs to a Supplier
            Expense.belongsTo(models.MasterDataSupplier, {
                foreignKey: 'supplierId',
                as: 'supplier'
            });
        }
    }

    Expense.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        contractId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Contracts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Hạng mục chi phí'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Diễn giải chi phí'
        },
        supplierId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'master_data_suppliers',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        totalAmount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: 'Tổng chi phí (VNĐ)'
        },
        contractStatus: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Trạng thái hợp đồng với NCC (ST01, ST02, ST03)'
        },
        paymentStatus: {
            type: DataTypes.ENUM('paid', 'unpaid'),
            defaultValue: 'unpaid',
            allowNull: false,
            comment: 'Trạng thái thanh toán'
        },
        pic: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Người phụ trách'
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Expense',
        tableName: 'expenses',
        timestamps: true
    });

    return Expense;
};
