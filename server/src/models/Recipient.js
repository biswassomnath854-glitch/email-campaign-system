const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Recipient = sequelize.define(
  "Recipient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    isSubscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "recipients",
    timestamps: true
  }
);

module.exports = Recipient;