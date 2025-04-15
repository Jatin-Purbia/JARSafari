const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Register the user
exports.registerUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    // Generate JWT token
    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, // Send the token in the response
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Login the user
exports.loginUser = async (req, res, next) => {
  console.log("Login request received:", req.body); // Debugging line
  console.log("Email:", req.body.email); // Debugging line
    console.log("Password:", req.body.password); // Debugging line
  try {
    const { email, password } = req.body;

    console.log("Email:", email); // Debugging line
    console.log("Password:", password); // Debugging line

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = user.getJWTToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send the token in the response
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Logout user (Client will simply remove token)
exports.logoutUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

// Get user details (protected)
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = req.user; // Provided by isAuthenticatedUser middleware
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update user password (protected)
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update user profile (protected)
exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
