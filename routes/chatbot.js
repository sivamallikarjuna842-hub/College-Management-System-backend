// Chatbot routes
const express = require("express");
const router = express.Router();
const { requireAdminAuth } = require("../middleware/auth");
const { askChatbot } = require("../controllers/chatbotController");

router.use(requireAdminAuth);

router.post("/", askChatbot);

module.exports = router;