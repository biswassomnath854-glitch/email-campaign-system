const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createRecipient,
  getRecipients
} = require("../controllers/recipientController");

const router = express.Router();

router.post("/", authenticate, createRecipient);

router.get("/", authenticate, getRecipients);

module.exports = router;