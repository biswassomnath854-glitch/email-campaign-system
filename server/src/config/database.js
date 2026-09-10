const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: "mysql",
    logging: false
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL database connected successfully");
  } catch (error) {
    console.error("MySQL database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDatabase
};