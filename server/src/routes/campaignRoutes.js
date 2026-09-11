const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", authenticate, createCampaign);

router.get("/", authenticate, getCampaigns);

router.get("/:id", authenticate, getCampaignById);

router.put("/:id", authenticate, updateCampaign);

module.exports = router;