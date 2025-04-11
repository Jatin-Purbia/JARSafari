// filepath: c:\Desktop\JARSafari\Backend\controllers\planController.js
const Plan = require("../models/planModel");
// Get all plans

// get all plans (admin exclusive)
exports.getAllPlans = async (req, res, next) => {
  console.log("Fetching all plans...");
  try {
    const plans = await Plan.find();
    res.status(200).json({
      success: true,
      message: "Fetched all plans successfully",
      plans
   });
  } 
  catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get a single plan (admin exclusive)
exports.getProductDetails = async (req, res, next) => {
  console.log("Fetching single plan...");
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
      // return next(new ErrorHandler("Plan not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Fetched plan successfully",
      plan
   });
  } 
  catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Create a new plan (admin exclusive)
exports.createPlan = async (req, res, next) => {
  console.log("Request Body:", req.body);
  try {
      const plan = await Plan.create(req.body);
      res.status(201).json({
          success: true,
          plan,
          message: "Plan created successfully",
      });
  } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({
          success: false,
          message: "Internal Server Error",
      });
  }
};

// Update a plan (admin exclusive)
exports.updatePlan = async (req, res, next) => {
  try{
    let plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
  });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
  }
  
};

// Delete a plan (admin exclusive)
exports.deletePlan = async (req, res, next) => {
  try {
      const plan = await Plan.findById(req.params.id);
      if (!plan) {
          return res.status(404).json({
              success: false,
              message: "Plan not found",
          });
      }
      console.log("Deleting Plan...");
      await plan.deleteOne();
      console.log("Plan deleted successfully");
      // Send the response back to the client
      return res.status(200).json({
        success: true,
        message: "Plan deleted successfully",
    });
  }
  catch (error) {
      console.error("Error deleting plan:", error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error",
      });
  }
};