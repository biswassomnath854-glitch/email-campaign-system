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

const getRecipientById = async (req, res, next) => {
  try {
    const recipient = await Recipient.findOne({
      where: {
        id: req.params.id,
        isActive: true
      }
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipient retrieved successfully",
      data: {
        recipient
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateRecipient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      isSubscribed,
      isActive
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingRecipient = await Recipient.findOne({
      where: {
        email: normalizedEmail
      }
    });

    if (
      existingRecipient &&
      existingRecipient.id !== recipient.id
    ) {
      return res.status(409).json({
        success: false,
        message: "Recipient with this email already exists"
      });
    }

    const updateData = {
      name: name.trim(),
      email: normalizedEmail
    };

    if (typeof isSubscribed === "boolean") {
      updateData.isSubscribed = isSubscribed;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    await recipient.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Recipient updated successfully",
      data: {
        recipient
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipient,
  getRecipients,
  getRecipientById,
  updateRecipient
};