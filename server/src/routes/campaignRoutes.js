const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createCampaign
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", authenticate, createCampaign);

module.exports = router;