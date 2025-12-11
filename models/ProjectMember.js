'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProjectMember extends Model {
        static associate(models) {
            // A ProjectMember belongs to a Contract
            ProjectMember.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                as: 'contract'
            });
        }
    }

    ProjectMember.init({
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
        memberCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Mã nhân viên'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Tên thành viên'
        },
        role: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Vai trò: PM, BA, Dev, Tester, etc.'
        }
    }, {
        sequelize,
        modelName: 'ProjectMember',
        tableName: 'project_members',
        timestamps: true
    });

    return ProjectMember;
};
