const {
  Campaign,
  Recipient,
  CampaignRecipient
} = require("../models");

const createCampaign = async (req, res, next) => {
  try {
    const { name, subject, content } = req.body;

    if (!name || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Name, subject and content are required"
      });
    }

    const campaign = await Campaign.create({
      userId: req.user.userId,
      name: name.trim(),
      subject: subject.trim(),
      content: content.trim(),
      status: "draft"
    });

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.findAll({
      where: {
        userId: req.user.userId
      },
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      message: "Campaigns retrieved successfully",
      data: {
        campaigns
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign retrieved successfully",
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateCampaign = async (req, res, next) => {
  try {
    const { name, subject, content } = req.body;

    if (!name || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Name, subject and content are required"
      });
    }

    const campaign = await Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    if (campaign.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft campaigns can be updated"
      });
    }

    await campaign.update({
      name: name.trim(),
      subject: subject.trim(),
      content: content.trim()
    });

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: {
        campaign
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    if (campaign.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft campaigns can be deleted"
      });
    }

    await campaign.destroy();

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

const addRecipientToCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID is required"
      });
    }

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    if (campaign.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft campaigns can have recipients added"
      });
    }

    const recipient = await Recipient.findOne({
      where: {
        id: recipientId,
        isActive: true
      }
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found"
      });
    }

    if (!recipient.isSubscribed) {
      return res.status(400).json({
        success: false,
        message: "Recipient is not subscribed"
      });
    }

    const existingCampaignRecipient =
      await CampaignRecipient.findOne({
        where: {
          campaignId: campaign.id,
          recipientId: recipient.id
        }
      });

    if (existingCampaignRecipient) {
      return res.status(409).json({
        success: false,
        message: "Recipient is already added to this campaign"
      });
    }

    const campaignRecipient = await CampaignRecipient.create({
      campaignId: campaign.id,
      recipientId: recipient.id,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Recipient added to campaign successfully",
      data: {
        campaignRecipient
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCampaignRecipients = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    const campaignRecipients = await CampaignRecipient.findAll({
      where: {
        campaignId: campaign.id
      },
      include: [
        {
          model: Recipient,
          as: "recipient",
          attributes: [
            "id",
            "name",
            "email",
            "isSubscribed",
            "isActive"
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      message: "Campaign recipients retrieved successfully",
      data: {
        campaignRecipients
      }
    });
  } catch (error) {
    next(error);
  }
};

const removeRecipientFromCampaign = async (req, res, next) => {
  try {
    const { campaignId, recipientId } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    if (campaign.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft campaigns can remove recipients"
      });
    }

    const campaignRecipient = await CampaignRecipient.findOne({
      where: {
        campaignId: campaign.id,
        recipientId
      }
    });

    if (!campaignRecipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient is not assigned to this campaign"
      });
    }

    await campaignRecipient.destroy();

    return res.status(200).json({
      success: true,
      message: "Recipient removed from campaign successfully"
    });
  } catch (error) {
    next(error);
  }
};

const updateCampaignRecipientStatus = async (req, res, next) => {
  try {
    const { campaignId, recipientId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "queued",
      "sent",
      "failed"
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are pending, queued, sent and failed"
      });
    }

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        userId: req.user.userId
      }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    const campaignRecipient = await CampaignRecipient.findOne({
      where: {
        campaignId: campaign.id,
        recipientId
      },
      include: [
        {
          model: Recipient,
          as: "recipient",
          attributes: [
            "id",
            "name",
            "email",
            "isSubscribed",
            "isActive"
          ]
        }
      ]
    });

    if (!campaignRecipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient is not assigned to this campaign"
      });
    }

    const updateData = {
      status
    };

    if (status === "sent") {
      updateData.sentAt = new Date();
    } else if (status !== "sent") {
      updateData.sentAt = null;
    }

    await campaignRecipient.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Campaign recipient status updated successfully",
      data: {
        campaignRecipient
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addRecipientToCampaign,
  getCampaignRecipients,
  removeRecipientFromCampaign,
  updateCampaignRecipientStatus
};