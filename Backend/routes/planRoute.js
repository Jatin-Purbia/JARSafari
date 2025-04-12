const express = require('express');
const { getAllPlans, createPlan, updatePlan, deletePlan, getPlanDetails } = require('../controllers/planController');

const router = express.Router();

// Get all plans
router.get("/plans", getAllPlans);

// Create new plan
router.post("/plans/new", createPlan);

// Get plan details
router.get("/plans/:id", getPlanDetails);

// Update plan
router.put("/plans/:id", updatePlan);

// Delete plan
router.delete("/plans/:id", deletePlan);

module.exports = router;