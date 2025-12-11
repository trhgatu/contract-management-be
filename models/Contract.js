'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      // Contract belongs to a Customer
      Contract.belongsTo(models.MasterDataCustomer, {
        foreignKey: 'customerId',
        as: 'customer'
      });

      // Contract belongs to a Status
      Contract.belongsTo(models.MasterDataStatus, {
        foreignKey: 'statusId',
        as: 'status'
      });

      // Contract belongs to a ContractType
      Contract.belongsTo(models.MasterDataContractType, {
        foreignKey: 'contractTypeId',
        as: 'contractType'
      });

      // Contract belongs to many Software (many-to-many)
      Contract.belongsToMany(models.MasterDataSoftware, {
        through: 'ContractSoftware',
        foreignKey: 'contractId',
        otherKey: 'softwareId',
        as: 'softwareTypes'
      });

      // Contract has many PaymentTerms
      Contract.hasMany(models.PaymentTerm, {
        foreignKey: 'contractId',
        as: 'paymentTerms'
      });

      // Contract has many Expenses
      Contract.hasMany(models.Expense, {
        foreignKey: 'contractId',
        as: 'expenses'
      });

      // Contract has many ProjectMembers
      Contract.hasMany(models.ProjectMember, {
        foreignKey: 'contractId',
        as: 'members'
      });

      // Contract has many Attachments
      Contract.hasMany(models.ContractAttachment, {
        foreignKey: 'contractId',
        as: 'attachments'
      });

      // Contract belongs to User (creator)
      Contract.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Contract.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Mã hợp đồng: HD-2025-001'
    },
    signDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Ngày ký hợp đồng'
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'master_data_customers',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nội dung hợp đồng'
    },
    contractTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'master_data_contract_types',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    valuePreVat: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Giá trị trước thuế (VNĐ)'
    },
    vat: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Thuế VAT (VNĐ)'
    },
    valuePostVat: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Giá trị sau thuế (VNĐ)'
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Thời gian thực hiện: 12 Tháng, 24 Tháng'
    },
    statusId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'master_data_status',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    acceptanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày nghiệm thu'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      comment: 'Người tạo hợp đồng'
    }
  }, {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
    timestamps: true
  });

  return Contract;
};
