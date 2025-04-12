const express = require("express");
const {
  getUserDetails,
  updatePassword,
  updateProfile,
  logoutUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth"); // Import JWT middleware
const router = express.Router();

// Logout User
router.route("/logout").get(logoutUser);

// Get User Details (Protected Route)
router.route("/users/me").get(auth, getUserDetails);

// Update Password (Protected Route)
router.route("/users/password").put(auth, updatePassword);

// Update Profile (Protected Route)
router.route("/users/profile").put(auth, updateProfile);
module.exports = router;
