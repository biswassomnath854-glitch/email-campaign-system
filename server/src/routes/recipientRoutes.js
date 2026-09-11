const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createRecipient
} = require("../controllers/recipientController");

const router = express.Router();

router.post("/", authenticate, createRecipient);

module.exports = router;