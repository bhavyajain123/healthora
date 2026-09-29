const { generateHealthResponse } = require("../services/geminiService");

async function chatWithAI(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Message must be 4000 characters or fewer.",
      });
    }

    if (!Array.isArray(history) || history.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Chat history is invalid.",
      });
    }

    const validHistory = history.every(
      (item) =>
        item &&
        ["user", "model"].includes(item.role) &&
        typeof item.text === "string" &&
        item.text.length <= 4000
    );

    if (!validHistory) {
      return res.status(400).json({
        success: false,
        message: "Chat history contains invalid messages.",
      });
    }

    const reply = await generateHealthResponse(message, history);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI chat error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Healthora AI is temporarily unavailable. Please try again.",
    });
  }
}

module.exports = { chatWithAI };