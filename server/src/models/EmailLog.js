const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const EmailLog = sequelize.define(
  "EmailLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "queued",
        "sent",
        "failed"
      ),
      allowNull: false,
      defaultValue: "queued"
    },

    messageId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "email_logs",
    timestamps: true
  }
);

module.exports = EmailLog;
