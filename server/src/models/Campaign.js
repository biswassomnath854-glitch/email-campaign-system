const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Campaign = sequelize.define(
  "Campaign",
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

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "scheduled",
        "processing",
        "completed",
        "failed"
      ),
      allowNull: false,
      defaultValue: "draft"
    },

    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "campaigns",
    timestamps: true
  }
);

module.exports = Campaign;