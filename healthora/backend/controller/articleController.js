const Article = require("../models/Article");

// Get all published articles
const getArticles = async (req, res) => {
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
};

// Get single article
const getArticleById = async (req, res) => {
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
};

// Create article
const createArticle = async (req, res) => {
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
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
};