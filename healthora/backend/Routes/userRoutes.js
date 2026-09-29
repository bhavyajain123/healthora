const express = require("express");

const protect =
  require("../middleware/firebaseAuthMiddleware");

const {
  getProfile,
  updateProfile
} =
  require("../controller/userController");


const router =
  express.Router();


router.get(
  "/profile",
  protect,
  getProfile
);


router.put(
  "/profile",
  protect,
  updateProfile
);


module.exports = router;