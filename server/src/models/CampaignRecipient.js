const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CampaignRecipient = sequelize.define(
  "CampaignRecipient",
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
        "pending",
        "queued",
        "sent",
        "failed"
      ),
      allowNull: false,
      defaultValue: "pending"
    },

    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "campaign_recipients",
    timestamps: true
  }
);

module.exports = CampaignRecipient;