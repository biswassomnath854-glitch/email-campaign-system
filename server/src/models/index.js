const { sequelize } = require("../config/database");
const User = require("./User");
const Campaign = require("./Campaign");
const Recipient = require("./Recipient");
const CampaignRecipient = require("./CampaignRecipient");

User.hasMany(Campaign, {
  foreignKey: "userId",
  as: "campaigns",
  onDelete: "CASCADE"
});

Campaign.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Campaign.belongsToMany(Recipient, {
  through: CampaignRecipient,
  foreignKey: "campaignId",
  otherKey: "recipientId",
  as: "recipients"
});

Recipient.belongsToMany(Campaign, {
  through: CampaignRecipient,
  foreignKey: "recipientId",
  otherKey: "campaignId",
  as: "campaigns"
});

CampaignRecipient.belongsTo(Campaign, {
  foreignKey: "campaignId",
  as: "campaign"
});

CampaignRecipient.belongsTo(Recipient, {
  foreignKey: "recipientId",
  as: "recipient"
});

Campaign.hasMany(CampaignRecipient, {
  foreignKey: "campaignId",
  as: "campaignRecipients",
  onDelete: "CASCADE"
});

Recipient.hasMany(CampaignRecipient, {
  foreignKey: "recipientId",
  as: "campaignRecipients",
  onDelete: "CASCADE"
});

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Campaign = Campaign;
db.Recipient = Recipient;
db.CampaignRecipient = CampaignRecipient;

module.exports = db;