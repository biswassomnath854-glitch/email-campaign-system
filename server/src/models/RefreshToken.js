const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "refresh_tokens",
    timestamps: true
  }
);

module.exports = RefreshToken;