const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addRecipientToCampaign,
  getCampaignRecipients,
  removeRecipientFromCampaign,
  updateCampaignRecipientStatus,
  scheduleCampaign,
  cancelScheduledCampaign
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", authenticate, createCampaign);

router.get("/", authenticate, getCampaigns);

router.get("/:id", authenticate, getCampaignById);

router.put("/:id", authenticate, updateCampaign);

router.delete("/:id", authenticate, deleteCampaign);

router.post(
  "/:campaignId/recipients",
  authenticate,
  addRecipientToCampaign
);

router.get(
  "/:campaignId/recipients",
  authenticate,
  getCampaignRecipients
);

router.patch(
  "/:campaignId/recipients/:recipientId/status",
  authenticate,
  updateCampaignRecipientStatus
);

router.delete(
  "/:campaignId/recipients/:recipientId",
  authenticate,
  removeRecipientFromCampaign
);

router.patch(
  "/:id/schedule",
  authenticate,
  scheduleCampaign
);

router.patch(
  "/:id/cancel",
  authenticate,
  cancelScheduledCampaign
);

module.exports = router;