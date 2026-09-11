const express = require("express");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const { protectedTest } = require("../controllers/testController");

const router = express.Router();

router.get("/protected", authenticate, protectedTest);

router.get(
  "/user-only",
  authenticate,
  authorize("user"),
  protectedTest
);

router.get(
  "/admin-only",
  authenticate,
  authorize("admin"),
  protectedTest
);

module.exports = router;