'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A User can have many Contracts
      User.hasMany(models.Contract, {
        foreignKey: 'userId',
        as: 'contracts',
        onDelete: 'CASCADE'
      });

      // User belongs to a UserGroup
      User.belongsTo(models.UserGroup, {
        foreignKey: 'groupId',
        as: 'group'
      });

      // User has many AuditLogs
      User.hasMany(models.AuditLog, {
        foreignKey: 'userId',
        as: 'auditLogs'
      });
    }

    // Instance method to match password
    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }

    // Get signed JWT token
    getSignedJwtToken() {
      return require('jsonwebtoken').sign(
        { id: this.id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user_groups',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'manager', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if(user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if(user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
};
