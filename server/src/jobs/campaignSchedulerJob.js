const cron = require("node-cron");

const {
  processScheduledCampaigns
} = require("../services/campaignScheduler");

const {
  queueCampaignEmails
} = require("../services/campaignQueueService");

const startCampaignScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Campaign scheduler started");

    try {
      const processedCampaigns =
        await processScheduledCampaigns();

      if (processedCampaigns.length === 0) {
        console.log(
          "No campaigns processed by scheduler"
        );

        return;
      }

      for (const campaignId of processedCampaigns) {
        await queueCampaignEmails(campaignId);
      }

      console.log(
        "Campaign scheduler completed successfully"
      );
    } catch (error) {
      console.error(
        "Campaign scheduler job failed"
      );
      console.error(error.message);
    }
  });

  console.log(
    "Campaign cron scheduler started successfully"
  );
};

module.exports = {
  startCampaignScheduler
};