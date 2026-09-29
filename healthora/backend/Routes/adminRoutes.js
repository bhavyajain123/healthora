const express = require("express");
const protect = require("../middleware/firebaseAuthMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin dashboard
router.get(
  "/dashboard",
  protect,
  adminOnly,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Healthora Admin Dashboard",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;