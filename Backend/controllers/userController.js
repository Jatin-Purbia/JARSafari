const User = require("../models/userModel"); // Import the User model
// const sendEmail = require("../utils/sendEmail"); // Import the sendEmail utility
// const crypto = require("crypto"); // Import crypto for generating reset tokens
const cookie = require("cookie"); // Import cookie for handling cookies
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for generating JWT tokens

// register the user
exports.registerUser = async (req, res, next) => {
  console.log("Request Body:", req.body);
  const {firstname, lastname, email, password} = req.body;
  try {
    const user = await User.create(req.body);

    const token = user.getJWTToken(); // Generate JWT token
    res.status(201).json({
      success: true,
      message: "User registered successfully",    
      user,
      token,
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
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }
  
  const user = await User.findOne({ email: req.body.email }).select("+password");
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

  const token = user.getJWTToken(); // Generate JWT token
  try {
    res.status(200).json({
      success: true,
      message: "User login successfully",
      user,
      token
    });
  } catch (error) {
    console.error("Error in logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",      
      error: error.message,
    });
  }
};

//logout user
exports.logoutUser = async (req, res, next) => {    
  
  res.cookie("token", null, {
    expires: new Date(Date.now()), // Set the expiration date to the past to delete the cookie
    httpOnly: true,
  });
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


//forgot password
// exports.forgotPassword = async (req, res, next) => {    
  
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).json({  
//       success: false,
//       message: "User not found",
//     });
//   } 

  // get user reset password token
//   const resetToken = user.getResetPasswordToken(); // Generate reset token
//   await user.save({ validateBeforeSave: false });
//   // create reset password url

//   const resetUrl =  `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
//   const message = `Your password reset token is as follow:\n\n ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

//   try {

//       await sendEmail({
//         email: user.email,
//         subject: `JARSafari Password Recovery`,
//         message,
//       });
//       res.status(200).json({  
//         success: true,
//         message: "User logged out successfully",
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save({ validateBeforeSave: false });
//       console.error("Error logging out user:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }  
// };  

//get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id); // Assuming req.user.id contains the authenticated user's ID
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
}


// update user password
exports.updatePassword = async (req, res, next) => {
  try {
      // Find the user by ID and include the password field
      const user = await User.findById(req.params.id).select("+password");

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      // Check if the old password matches
      const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
      if (!isPasswordMatched) {
          return res.status(401).json({
              success: false,
              message: "Invalid old password",
          });
      }

      // Check if the new password and confirm password match
      if (req.body.password !== req.body.confirmPassword) {
          return res.status(400).json({
              success: false,
              message: "Password and confirm password do not match",
          });
      }

      // Update the password
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


// update user profile  
exports.updateProfile = async (req, res, next) => {
  try {
      const newUserData = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
      };

      // Update the user's profile
      const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
          new: true, // Return the updated document
          runValidators: true, // Validate the updated fields
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