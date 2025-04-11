const User = require("../models/userSchema");

// register the user
exports.registerUser = async (req, res, next) => {
  console.log("Request Body:", req.body);
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",    
      user,
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


// login the user
exports.loginUser = async (req, res, next) => {
  console.log("Request Body:", req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
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

// logout the user
exports.logoutUser = async (req, res, next) => {    
  console.log("Request Body:", req.body);
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",      
      error: error.message,
    });
  }
};
