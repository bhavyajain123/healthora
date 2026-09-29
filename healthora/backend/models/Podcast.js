const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },
   

    audioUrl: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
    type: String,
    default: "",
    trim: true,
},

    category: {
      type: String,
      required: true,
      enum: [
        "Mental Health",
        "Fitness",
        "Nutrition",
        "Lifestyle",
        "General",
      ],
    },

    duration: {
      type: String,
      default: "00:00",
    },

    host: {
      type: String,
      default: "Healthora Team",
    },

    episodeNumber: {
      type: Number,
      default: 1,
    },

    listens: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;