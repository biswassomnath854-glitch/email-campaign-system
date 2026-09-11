const express = require("express");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  createRecipient,
  getRecipients,
  getRecipientById,
  updateRecipient,
  deleteRecipient
} = require("../controllers/recipientController");

const router = express.Router();

router.post("/", authenticate, createRecipient);

router.get("/", authenticate, getRecipients);

router.get("/:id", authenticate, getRecipientById);

router.put("/:id", authenticate, updateRecipient);

router.delete("/:id", authenticate, deleteRecipient);

module.exports = router;