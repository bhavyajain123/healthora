const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin authorization failed",
      error: error.message,
    });
  }
};

module.exports = adminOnly;