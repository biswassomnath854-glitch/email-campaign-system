const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const { connectDatabase } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const recipientRoutes = require("./routes/recipientRoutes");

const {
  startCampaignScheduler
} = require("./jobs/campaignSchedulerJob");

const app = express();

app.use(cors());
app.use(express.json());

app.use(`${env.apiPrefix}/auth`, authRoutes);
app.use(`${env.apiPrefix}/test`, testRoutes);
app.use(`${env.apiPrefix}/campaigns`, campaignRoutes);
app.use(`${env.apiPrefix}/recipients`, recipientRoutes);

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

    startCampaignScheduler();
  });
};

startServer();