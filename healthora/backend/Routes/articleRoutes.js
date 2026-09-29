const express = require("express");
const Article = require("../models/Article");

const router = express.Router();

// GET all published articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
      error: error.message,
    });
  }
});

// GET single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: error.message,
    });
  }
});

// POST create a new article
router.post("/", async (req, res) => {
  try {
    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create article",
      error: error.message,
    });
  }
});

module.exports = router;