const { Op } = require("sequelize");

const {
  Campaign
} = require("../models");

const processScheduledCampaigns = async () => {
  try {
    const now = new Date();

    const campaigns = await Campaign.findAll({
      where: {
        status: "scheduled",
        scheduledAt: {
          [Op.lte]: now
        },
        isActive: true
      }
    });

    if (campaigns.length === 0) {
      console.log("No scheduled campaigns are ready for processing");
      return [];
    }

    const processedCampaigns = [];

    for (const campaign of campaigns) {
      await campaign.update({
        status: "processing"
      });

      console.log(
        `Campaign ${campaign.id} moved from scheduled to processing`
      );

      processedCampaigns.push(campaign.id);
    }

    return processedCampaigns;
  } catch (error) {
    console.error("Scheduled campaign processing failed");
    console.error(error.message);

    throw error;
  }
};

module.exports = {
  processScheduledCampaigns
};