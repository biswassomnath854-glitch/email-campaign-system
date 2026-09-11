const {
  Campaign,
  CampaignRecipient
} = require("../models");

const completeCampaign = async (campaignId) => {
  const campaign = await Campaign.findByPk(campaignId);

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (campaign.status !== "processing") {
    throw new Error(
      "Only processing campaigns can be completed"
    );
  }

  const recipients = await CampaignRecipient.findAll({
    where: {
      campaignId
    }
  });

  if (recipients.length === 0) {
    throw new Error(
      "Campaign has no recipients"
    );
  }

  const hasUnprocessedRecipients = recipients.some(
    (recipient) =>
      recipient.status === "pending" ||
      recipient.status === "queued"
  );

  if (hasUnprocessedRecipients) {
    return {
      completed: false,
      status: campaign.status,
      message: "Campaign still has unprocessed recipients"
    };
  }

  const hasFailedRecipients = recipients.some(
    (recipient) => recipient.status === "failed"
  );

  const newStatus = hasFailedRecipients
    ? "failed"
    : "completed";

  await campaign.update({
    status: newStatus
  });

  console.log(
    `Campaign ${campaign.id} marked as ${newStatus}`
  );

  return {
    completed: true,
    status: newStatus,
    message: `Campaign marked as ${newStatus}`
  };
};

module.exports = {
  completeCampaign
};