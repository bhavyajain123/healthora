const express = require("express");
const Podcast = require("../models/Podcast");

const router = express.Router();

// GET all published podcasts
router.get("/", async (req, res) => {
  try {
    const podcasts = await Podcast.find({ published: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: podcasts.length,
      data: podcasts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch podcasts",
      error: error.message,
    });
  }
});

// GET single podcast by ID
router.get("/:id", async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: "Podcast not found",
      });
    }

    res.status(200).json({
      success: true,
      data: podcast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch podcast",
      error: error.message,
    });
  }
});

// POST create a new podcast
router.post("/", async (req, res) => {
  try {
    const podcast = await Podcast.create(req.body);

    res.status(201).json({
      success: true,
      message: "Podcast created successfully",
      data: podcast,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create podcast",
      error: error.message,
    });
  }
});

module.exports = router;