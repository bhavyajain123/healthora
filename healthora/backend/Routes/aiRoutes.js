const express = require("express");
const { chatWithAI } = require("../controller/aiController");

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", chatWithAI);

module.exports = router;