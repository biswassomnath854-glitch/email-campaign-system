const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createRecipient,
  getRecipients,
  getRecipientById
} = require("../controllers/recipientController");

const router = express.Router();

router.post("/", authenticate, createRecipient);

router.get("/", authenticate, getRecipients);

router.get("/:id", authenticate, getRecipientById);

module.exports = router;