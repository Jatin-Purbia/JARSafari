const express = require('express');
const { getAllPlans, createPlan, updatePlan, deletePlan, getProductDetails } = require('../controllers/planController');

const router= express.Router();

//get all plans
router.route("/plans").get(getAllPlans);
router.route("/plans/new").post(createPlan);
router.route("/plans/:id").put(updatePlan);
router.route("/plans/:id").delete(deletePlan);
router.route("/plans/:id").get(getProductDetails);

module.exports = router