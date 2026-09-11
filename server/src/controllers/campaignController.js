const { Campaign } = require("../models");

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

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign
};