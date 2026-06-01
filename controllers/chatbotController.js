// Chatbot controller
const { chatbotReply } = require("../utils/chatbot");

async function askChatbot(req, res) {
  try {
    const prompt = req.body?.prompt ?? req.query?.prompt;
    const reply = chatbotReply(prompt);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: "Chatbot failed", details: error?.message });
  }
}

module.exports = { askChatbot };