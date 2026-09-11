const {
  Campaign,
  CampaignRecipient,
  Recipient
} = require("../models");

const emailQueue = require("../queues/emailQueue");

const queueCampaignEmails = async (campaignId) => {
  const campaign = await Campaign.findByPk(campaignId);

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (campaign.status !== "processing") {
    throw new Error(
      "Only processing campaigns can be queued"
    );
  }

  const campaignRecipients = await CampaignRecipient.findAll({
    where: {
      campaignId: campaign.id,
      status: "pending"
    },
    include: [
      {
        model: Recipient,
        as: "recipient",
        where: {
          isActive: true,
          isSubscribed: true
        }
      }
    ]
  });

  if (campaignRecipients.length === 0) {
    console.log(
      `No pending recipients found for campaign ${campaign.id}`
    );

    return [];
  }

  const queuedRecipients = [];

  for (const campaignRecipient of campaignRecipients) {
    const recipient = campaignRecipient.recipient;

    const job = await emailQueue.add("sendCampaignEmail", {
      to: recipient.email,
      subject: campaign.subject,
      text: campaign.content,
      campaignId: campaign.id,
      recipientId: recipient.id
    });

    await campaignRecipient.update({
      status: "queued"
    });

    console.log(
      `Campaign ${campaign.id} recipient ${recipient.id} queued with job ${job.id}`
    );

    queuedRecipients.push({
      campaignRecipientId: campaignRecipient.id,
      recipientId: recipient.id,
      jobId: job.id
    });
  }

  return queuedRecipients;
};

module.exports = {
  queueCampaignEmails
};