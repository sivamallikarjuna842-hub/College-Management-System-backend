// Auth routes
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { loginHandler } = require("../controllers/authController");

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, loginHandler);

module.exports = router;