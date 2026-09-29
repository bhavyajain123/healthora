const express = require("express");
const User = require("../models/User");
const firebaseAuth = require("../middleware/firebaseAuthMiddleware");

const router = express.Router();

// Get currently logged-in Firebase user
router.get("/me", firebaseAuth, async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.user.email,
    }).select("-password");

    // Create MongoDB user if not already present
    if (!user) {
      user = await User.create({
        name: req.user.name || "Healthora User",
        email: req.user.email,
        profileImage: req.user.picture || "",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

module.exports = router;