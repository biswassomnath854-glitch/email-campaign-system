const { Recipient } = require("../models");

const createRecipient = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingRecipient = await Recipient.findOne({
      where: {
        email: normalizedEmail
      }
    });

    if (existingRecipient) {
      return res.status(409).json({
        success: false,
        message: "Recipient with this email already exists"
      });
    }

    const recipient = await Recipient.create({
      name: name.trim(),
      email: normalizedEmail,
      isSubscribed: true,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: "Recipient created successfully",
      data: {
        recipient
      }
    });
  } catch (error) {
    next(error);
  }
};

const getRecipients = async (req, res, next) => {
  try {
    const recipients = await Recipient.findAll({
      where: {
        isActive: true
      },
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      message: "Recipients retrieved successfully",
      data: {
        recipients
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipient,
  getRecipients
};