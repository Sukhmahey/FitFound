// routers/jobRouters.js
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/JobFormController"); 

// Route for creating a new job posting
// POST /api/jobs
router.post("/", jobController.createJob);

// Route for fetching all job postings (supports optional employerId query filter)
// GET /api/jobs?employerId=:employerId
// GET /api/jobs
router.get("/", jobController.getAllJobs);

// Route for fetching a single job posting by its ID
// GET /api/jobs/:jobId
router.get("/:jobId", jobController.getJobById);

// === Job Management (Update & Delete) ===

// Route for partially updating an existing job posting
// PATCH /api/jobs/:jobId
router.patch("/:jobId", jobController.updateJobById);

// Route for deleting a specific job posting
// DELETE /api/jobs/:jobId
router.delete("/:jobId", jobController.deleteJobById);

// === Test Route (for quick verification) ===
router.get("/test", (req, res) => res.send("Job route test passed"));

module.exports = router;
