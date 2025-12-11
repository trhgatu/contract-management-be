'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ContractAttachment extends Model {
        static associate(models) {
            // An Attachment belongs to a Contract
            ContractAttachment.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                as: 'contract'
            });
        }
    }

    ContractAttachment.init({
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Tên file'
        },
        size: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Kích thước file'
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Loại file: pdf, docx, xlsx, etc.'
        },
        uploadDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Ngày upload'
        },
        filePath: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Đường dẫn file trên server'
        }
    }, {
        sequelize,
        modelName: 'ContractAttachment',
        tableName: 'contract_attachments',
        timestamps: true
    });

    return ContractAttachment;
};
