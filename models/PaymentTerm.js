'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PaymentTerm extends Model {
        static associate(models) {
            // A PaymentTerm belongs to a Contract
            PaymentTerm.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                as: 'contract'
            });
        }
    }

    PaymentTerm.init({
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
        batch: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Đợt thanh toán: Đợt 1, Đợt 2, etc.'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Nội dung thanh toán'
        },
        ratio: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Tỷ lệ % thanh toán'
        },
        value: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: 'Số tiền (VNĐ)'
        },
        isCollected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            comment: 'Đã thu tiền chưa'
        },
        collectionDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Ngày thu tiền'
        },
        invoiceStatus: {
            type: DataTypes.ENUM('exported', 'not_exported'),
            defaultValue: 'not_exported',
            allowNull: false,
            comment: 'Trạng thái hóa đơn'
        }
    }, {
        sequelize,
        modelName: 'PaymentTerm',
        tableName: 'payment_terms',
        timestamps: true
    });

    return PaymentTerm;
};
