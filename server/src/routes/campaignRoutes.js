const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createCampaign,
  getCampaigns
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", authenticate, createCampaign);
router.get("/", authenticate, getCampaigns);

module.exports = router;