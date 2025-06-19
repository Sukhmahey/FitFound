// controllers/JobFormController.js (assuming this is the correct filename)
const Job = require("../models/JobModel"); // Correct model name is typically 'Job' based on your schema: 'const Job = mongoose.model("Job", JobSchema);'

// Helper function for consistent error handling and logging
const handleError = (res, error, message, status = 500) => {
  console.error(`[JobFormController] ${message}:`, error);
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

/**
 * @route POST /api/jobs
 * @desc Create a new job posting
 * @access Private (Employer Only - will need auth middleware)
 */
exports.createJob = async (req, res) => {
  // In a real app, employerId should come from auth middleware (e.g., req.user.id)
  // For now, we'll assume it's sent in the body for testing, but recommend against this in production.
  const {
    employerId,
    jobTitle,
    jobDescription,
    requiredSkills,
    mustHaveCriteria,
    salaryRange,
    location,
    jobType,
  } = req.body;

  try {
    console.log(
      `[createJob] Attempting to create new job for employerId: ${employerId}`
    );
    console.log(`[createJob] Received job data:`, req.body);

    const newJob = new Job({
      employerId,
      jobTitle,
      jobDescription,
      requiredSkills,
      mustHaveCriteria,
      salaryRange,
      location,
      jobType,
    });

    const savedJob = await newJob.save();
    console.log(
      `[createJob] New job created with ID: ${savedJob._id} for employerId: ${employerId}`
    );
    res.status(201).json(savedJob); // 201 Created for successful resource creation
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to create job posting",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

/**
 * @route GET /api/jobs
 * @desc Fetch all job postings (supports optional employerId query filter)
 * @access Public (or Private, depending on app logic)
 */
exports.getAllJobs = async (req, res) => {
  const { employerId } = req.query; // Get employerId from query parameters

  let filter = {};
  if (employerId) {
    filter.employerId = employerId;
    console.log(
      `[getAllJobs] Fetching jobs filtered by employerId: ${employerId}`
    );
  } else {
    console.log(
      "[getAllJobs] Fetching all job postings (no employerId filter)."
    );
  }

  try {
    const jobs = await Job.find(filter); // Apply the filter if present
    console.log(`[getAllJobs] Found ${jobs.length} job(s).`);
    res.status(200).json(jobs);
  } catch (error) {
    handleError(res, error, "Failed to fetch job postings", 500);
  }
};

/**
 * @route GET /api/jobs/:jobId
 * @desc Fetch a single job posting by its jobId
 * @access Public (or Private)
 */
exports.getJobById = async (req, res) => {
  const { jobId } = req.params;
  try {
    console.log(`[getJobById] Fetching job with ID: ${jobId}`);
    const job = await Job.findById(jobId); // Find by the document's _id

    if (!job) {
      console.log(`[getJobById] Job not found for ID: ${jobId}`);
      return res.status(404).json({ message: "Job posting not found" });
    }

    console.log(`[getJobById] Job found with ID: ${jobId}`);
    res.status(200).json(job);
  } catch (error) {
    handleError(res, error, "Failed to fetch job posting", 500);
  }
};

/**
 * @route PATCH /api/jobs/:jobId
 * @desc Partially update fields in a job posting
 * @access Private (Employer Only - will need auth middleware to check ownership)
 */
exports.updateJobById = async (req, res) => {
  const { jobId } = req.params;
  const updates = req.body; // Contains the fields to update

  // Optional: Check if updates object is empty
  if (!updates || Object.keys(updates).length === 0) {
    console.log(
      `[updateJobById] Invalid request: Empty body for job update on ID: ${jobId}`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    console.log(`[updateJobById] PATCH request received for jobId: ${jobId}`);
    console.log(`[updateJobById] Updates for job:`, updates);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates }, // Use $set to update only the provided fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedJob) {
      console.log(`[updateJobById] Job not found for ID: ${jobId}`);
      return res.status(404).json({ message: "Job posting not found" });
    }

    console.log(`[updateJobById] Job updated for ID: ${jobId}`);
    res.status(200).json(updatedJob);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update job posting",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

/**
 * @route DELETE /api/jobs/:jobId
 * @desc Delete a job posting by its jobId
 * @access Private (Employer Only - will need auth middleware to check ownership)
 */
exports.deleteJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    console.log(`[deleteJobById] DELETE request received for jobId: ${jobId}`);
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      console.log(`[deleteJobById] Job not found for ID: ${jobId}`);
      return res.status(404).json({ message: "Job posting not found" });
    }

    console.log(`[deleteJobById] Job deleted successfully for ID: ${jobId}`);
    // You can send 200 OK with a message, or 204 No Content for a successful deletion.
    res.status(200).json({ message: "Job posting deleted successfully." });
    // Alternative for DELETE with no content: res.status(204).send();
  } catch (error) {
    handleError(res, error, "Failed to delete job posting", 500);
  }
};
