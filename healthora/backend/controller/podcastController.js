const Podcast = require("../models/Podcast");

// Get all published podcasts
const getPodcasts = async (req, res) => {
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
};

// Get single podcast
const getPodcastById = async (req, res) => {
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
};

// Create podcast
const createPodcast = async (req, res) => {
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
};

module.exports = {
  getPodcasts,
  getPodcastById,
  createPodcast,
};