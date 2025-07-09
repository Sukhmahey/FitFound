const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insightsController");

const authMiddleware = (req, res, next) => {
  req.user = { candidateId: "686763634fc8000281fade37" }; // Example candidate for GET routes
  next();
};

// A SIMPLE ROUTE TO LOG THE DATA YOU PROVIDE
// POST /api/insights/log-appearance
router.post("/log-appearance", insightsController.logAppearance);
router.post("/log-bulk-appearance", insightsController.logBulkAppearance);
// Route for the "Profile Visibility" line chart
// GET /api/insights/visibility-timeline
router.get(
  "/visibility-timeline/:candidateId",
  insightsController.getVisibilityTimeline
);

// GET /api/insights/skill-breakdown/:candidateId
router.get(
  "/skill-breakdown/:candidateId",
  insightsController.getSkillBreakdown
);
  

module.exports = router;
