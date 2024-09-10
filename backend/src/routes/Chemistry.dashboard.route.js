const express = require("express");
const DashboardController = require("../controllers/ChemistryDashboardController");
const router = express.Router();

// Route to get dashboard summary for all categories
router.get("/cards-data", DashboardController.getDashboardSummary);

module.exports = router;
