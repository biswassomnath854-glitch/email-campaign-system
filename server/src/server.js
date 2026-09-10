const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const { connectDatabase } = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get(`${env.apiPrefix}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: `${env.appName} API is running`,
    environment: env.nodeEnv
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `${env.appName} server running at http://localhost:${env.port}`
    );
  });
};

startServer();