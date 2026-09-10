const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  appName: process.env.APP_NAME || "Email Campaign System",
  apiPrefix: process.env.API_PREFIX || "/api",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || "email_campaign_system",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  }
};

module.exports = env;