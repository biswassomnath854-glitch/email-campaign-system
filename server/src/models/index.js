const { sequelize } = require("../config/database");
const User = require("./User");
const Campaign = require("./Campaign");
const Recipient = require("./Recipient");

User.hasMany(Campaign, {
  foreignKey: "userId",
  as: "campaigns",
  onDelete: "CASCADE"
});

Campaign.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Campaign = Campaign;
db.Recipient = Recipient;

module.exports = db;