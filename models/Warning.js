'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Warning extends Model {
        static associate(models) {
            // A Warning belongs to a Contract
            Warning.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                as: 'contract'
            });
        }
    }

    Warning.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(
                'acceptance_upcoming',
                'acceptance_overdue',
                'payment_upcoming',
                'payment_overdue',
                'contract_expired'
            ),
            allowNull: false,
            comment: 'Loại cảnh báo'
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
        contractCode: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Mã hợp đồng (denormalized for quick access)'
        },
        customerName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Tên khách hàng (denormalized)'
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Ngày đến hạn'
        },
        daysDiff: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Số ngày còn lại (âm = quá hạn, dương = sắp đến hạn)'
        },
        amount: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 0,
            comment: 'Số tiền liên quan (nếu là payment warning)'
        },
        pic: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Người phụ trách'
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'resolved'),
            defaultValue: 'pending',
            allowNull: false,
            comment: 'Trạng thái xử lý cảnh báo'
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Ghi chú xử lý'
        },
        details: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Chi tiết bổ sung: Đợt 2 - 30%, Nghiệm thu giai đoạn 1, etc.'
        }
    }, {
        sequelize,
        modelName: 'Warning',
        tableName: 'warnings',
        timestamps: true
    });

    return Warning;
};
