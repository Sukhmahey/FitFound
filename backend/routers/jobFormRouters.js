// routers/jobRouters.js
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/JobFormController"); 


// POST /api/jobs
router.post("/", jobController.createJob);


// GET /api/jobs
router.get("/", jobController.getAllJobs);


// GET /api/jobs/:jobId
router.get("/:jobId", jobController.getJobById);




router.patch("/:jobId", jobController.updateJobById);


router.delete("/:jobId", jobController.deleteJobById);

// Test route to verify the job router is working
router.get("/test", (req, res) => res.send("Job route test passed"));

module.exports = router;
