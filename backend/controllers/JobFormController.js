const Job = require("../models/JobModel");

const handleError = (res, error, message, status = 500) => {
  console.error(`[JobFormController] ${message}:`, error);
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

exports.createJob = async (req, res) => {
  const {
    employerId,
    jobTitle,
    jobDescription,
    requiredSkills,
    mustHaveCriteria,
    salaryRange,
    location,
    jobType,
    workEnvironment,
    requiredWorkAuthorization, // Added new field
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
      workEnvironment,
      requiredWorkAuthorization, // Added new field
    });

    const savedJob = await newJob.save();
    console.log(
      `[createJob] New job created with ID: ${savedJob._id} for employerId: ${employerId}`
    );
    res.status(201).json(savedJob);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to create job posting",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.getAllJobs = async (req, res) => {
  const {
    employerId,
    jobType,
    location,
    workEnvironment,
    minSalary,
    maxSalary,
    skill,
    requiredWorkAuthorization, 
  } = req.query;

  let filter = {};
  if (employerId) {
    filter.employerId = employerId;
  }
  if (jobType) {
    filter.jobType = jobType;
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (workEnvironment) {
    filter.workEnvironment = workEnvironment;
  }
  if (minSalary) {
    filter["salaryRange.min"] = { $gte: parseInt(minSalary) };
  }
  if (maxSalary) {
    filter["salaryRange.max"] = { $lte: parseInt(maxSalary) };
  }
  if (skill) {
    filter["requiredSkills.skill"] = { $regex: skill, $options: "i" };
  }
  // NEW: Filter jobs based on their required work authorization.
  // This helps candidates find jobs they are eligible for.
  if (requiredWorkAuthorization) {
    // If the query parameter is a single string, we search if that string is in the job's array
    // If multiple are sent (e.g., ?requiredWorkAuthorization=PR%20Citizen&requiredWorkAuthorization=Work%20Permit),
    // Express will typically parse it as an array.
    const searchAuths = Array.isArray(requiredWorkAuthorization)
      ? requiredWorkAuthorization
      : [requiredWorkAuthorization];
    filter.requiredWorkAuthorization = { $in: searchAuths };
  }

  try {
    const jobs = await Job.find(filter);
    res.status(200).json(jobs);
  } catch (error) {
    handleError(res, error, "Failed to fetch job postings", 500);
  }
};

exports.getJobById = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    handleError(res, error, "Failed to fetch job posting", 500);
  }
};

exports.updateJobById = async (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job posting not found" });
    }

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

exports.deleteJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json({ message: "Job posting deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete job posting", 500);
  }
};
