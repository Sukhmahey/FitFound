const Candidate = require("../models/CandidateModel");

const handleError = (res, error, message, status = 500) => {
  console.error(`[CandidateController] ${message}:`, error);
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

// General Profile Operations

exports.createCandidateProfile = async (req, res) => {
  const {
    userId,
    personalInfo,
    basicInfo,
    skills,
    workHistory,
    portfolio,
    education,
    jobPreference,
  } = req.body;

  try {
    const existingProfile = await Candidate.findOne({ userId });
    if (existingProfile) {
      return res
        .status(409)
        .json({ message: "Candidate profile already exists for this user." });
    }

    const newCandidateProfile = new Candidate({
      userId,
      personalInfo,
      basicInfo,
      skills,
      workHistory,
      portfolio,
      education,
      jobPreference,
    });

    const savedProfile = await newCandidateProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to create candidate profile",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.getCandidateByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const candidate = await Candidate.findOne({ userId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate profile", 500);
  }
};

exports.getAllCandidateProfiles = async (req, res) => {
  // Major change: Added comprehensive filtering for employer search criteria
  const {
    title, // Corresponds to employer's "Title" search for desired job title
    jobType, // Corresponds to employer's "Job Type" search (candidate's preferred job type)
    location, // Corresponds to employer's "Location" search (candidate's location)
    salaryFrom, // Corresponds to employer's "Salary Range From"
    salaryTo, // Corresponds to employer's "Salary Range To"
    jobDescriptionKeywords, // Corresponds to employer's "Job Description" (keywords for candidate bio/experience)
    workStatus, // Corresponds to employer's "Work Status" (candidate's immigration/residency status)
    skills, // Corresponds to employer's "Skills" search
  } = req.query;

  let filter = {};


  if (title) {
    filter["jobPreference.desiredJobTitle"] = { $regex: title, $options: "i" }; // Case-insensitive search
  }


  if (jobType) {
    filter["jobPreference.jobType"] = jobType;
  }


  if (location) {
    filter["basicInfo.location"] = { $regex: location, $options: "i" }; // Case-insensitive search
  }


  if (salaryFrom || salaryTo) {
    filter["jobPreference.salaryExpectation.min"] = {};
    if (salaryFrom) {
      filter["jobPreference.salaryExpectation.min"].$gte = parseInt(salaryFrom);
    }
    if (salaryTo) {
      filter["jobPreference.salaryExpectation.min"].$lte = parseInt(salaryTo);
    }
  }


  if (jobDescriptionKeywords) {
    filter["basicInfo.bio"] = { $regex: jobDescriptionKeywords, $options: "i" }; // Case-insensitive search
  }


  if (workStatus) {
    const searchWorkStatuses = Array.isArray(workStatus)
      ? workStatus
      : [workStatus];
    filter["basicInfo.workStatus"] = { $in: searchWorkStatuses };
  }


  if (skills) {
    const searchSkills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s) => s.trim());
    filter["skills.skill"] = {
      $in: searchSkills.map((s) => new RegExp(s, "i")),
    }; // Case-insensitive match for each skill
  }

  try {
    const candidateProfiles = await Candidate.find(filter);
    res.status(200).json(candidateProfiles);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate profiles", 500);
  }
};

exports.updateCandidateProfile = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    res.status(200).json(updatedCandidate);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update candidate profile",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteCandidateProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedProfile = await Candidate.findOneAndDelete({ userId });
    if (!deletedProfile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }
    res
      .status(200)
      .json({ message: "Candidate profile deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete candidate profile", 500);
  }
};

// Nested Object Update Endpoints

exports.updatePersonalInfo = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      {
        $set: {
          "personalInfo.firstName": updates.firstName,
          "personalInfo.middleName": updates.middleName,
          "personalInfo.lastName": updates.lastName,
          "personalInfo.email": updates.email,
          "personalInfo.currentStatus": updates.currentStatus,
          "personalInfo.specialization": updates.specialization,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.personalInfo);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update personal info",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateBasicInfo = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      {
        $set: {
          "basicInfo.phoneNumber": updates.phoneNumber,
          "basicInfo.workStatus": updates.workStatus,
          "basicInfo.language": updates.language,
          "basicInfo.bio": updates.bio,
          "basicInfo.additionalInfo": updates.additionalInfo,
          "basicInfo.location": updates.location, // ADDED: to allow updating location
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.basicInfo);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update basic info",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updatePortfolio = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const updateQuery = {};
  if (updates.socialLinks && typeof updates.socialLinks === "object") {
    for (const key in updates.socialLinks) {
      updateQuery[`portfolio.socialLinks.${key}`] = updates.socialLinks[key];
    }
  }

  if (Object.keys(updateQuery).length === 0) {
    return res.status(400).json({
      message: "Request body must contain valid portfolio fields to update.",
    });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: updateQuery },
      { new: true, runValidators: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.portfolio);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update portfolio",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateJobPreference = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      {
        $set: {
          "jobPreference.desiredJobTitle": updates.desiredJobTitle,
          "jobPreference.jobType": updates.jobType,
          "jobPreference.salaryExpectation.min": updates.salaryExpectation?.min,
          "jobPreference.salaryExpectation.perHour":
            updates.salaryExpectation?.perHour,
          "jobPreference.salaryExpectation.perYear":
            updates.salaryExpectation?.perYear,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.jobPreference);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update job preferences",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

// Skills Endpoints

exports.updateSkills = async (req, res) => {
  const { userId } = req.params;
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return res
      .status(400)
      .json({ message: "Request body must contain a 'skills' array." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { skills: skills } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.skills);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update skills",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.addSkillEntry = async (req, res) => {
  const { userId } = req.params;
  const newSkillEntry = req.body;

  if (!newSkillEntry || Object.keys(newSkillEntry).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain a new skill entry." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $push: { skills: newSkillEntry } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(201).json(updatedCandidate.skills);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to add skill entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateSkillEntryById = async (req, res) => {
  const { userId, skillId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`skills.$[elem].${key}`] = updates[key];
      }
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId, "skills._id": skillId },
      { $set: updateOperation },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "elem._id": skillId }],
      }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or skill entry not found." });
    }
    const updatedEntry = updatedCandidate.skills.id(skillId);
    if (!updatedEntry) {
      return res.status(404).json({
        message: "Skill entry not found within the candidate's profile.",
      });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update skill entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteSkillEntryById = async (req, res) => {
  const { userId, skillId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or skill entry not found." });
    }
    res.status(200).json({ message: "Skill entry deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete skill entry", 500);
  }
};

// Work History Endpoints

exports.updateWorkHistory = async (req, res) => {
  const { userId } = req.params;
  const { workHistory } = req.body;

  if (!Array.isArray(workHistory)) {
    return res
      .status(400)
      .json({ message: "Request body must contain a 'workHistory' array." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { workHistory: workHistory } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.workHistory);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update work history",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.addWorkHistoryEntry = async (req, res) => {
  const { userId } = req.params;
  const newWorkEntry = req.body;

  if (!newWorkEntry || Object.keys(newWorkEntry).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain a new work history entry." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $push: { workHistory: newWorkEntry } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(201).json(updatedCandidate.workHistory);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to add work history entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateWorkEntryById = async (req, res) => {
  const { userId, entryId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`workHistory.$[elem].${key}`] = updates[key];
      }
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId, "workHistory._id": entryId },
      { $set: updateOperation },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "elem._id": entryId }],
      }
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        message: "Candidate profile or work history entry not found.",
      });
    }
    const updatedEntry = updatedCandidate.workHistory.id(entryId);
    if (!updatedEntry) {
      return res.status(404).json({
        message: "Work history entry not found within the candidate's profile.",
      });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update work history entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteWorkEntryById = async (req, res) => {
  const { userId, entryId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $pull: { workHistory: { _id: entryId } } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        message: "Candidate profile or work history entry not found.",
      });
    }
    res
      .status(200)
      .json({ message: "Work history entry deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete work history entry", 500);
  }
};

// Education Endpoints

exports.updateEducation = async (req, res) => {
  const { userId } = req.params;
  const { education } = req.body;

  if (!Array.isArray(education)) {
    return res
      .status(400)
      .json({ message: "Request body must contain an 'education' array." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { education: education } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json(updatedCandidate.education);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update education",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.addEducationEntry = async (req, res) => {
  const { userId } = req.params;
  const newEducationEntry = req.body;

  if (!newEducationEntry || Object.keys(newEducationEntry).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain a new education entry." });
  }

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $push: { education: newEducationEntry } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(201).json(updatedCandidate.education);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to add education entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateEducationById = async (req, res) => {
  const { userId, entryId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`education.$[elem].${key}`] = updates[key];
      }
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId, "education._id": entryId },
      { $set: updateOperation },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "elem._id": entryId }],
      }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or education entry not found." });
    }
    const updatedEntry = updatedCandidate.education.id(entryId);
    if (!updatedEntry) {
      return res.status(404).json({
        message: "Education entry not found within the candidate's profile.",
      });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update education entry",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteEducationById = async (req, res) => {
  const { userId, entryId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $pull: { education: { _id: entryId } } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or education entry not found." });
    }
    res.status(200).json({ message: "Education entry deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete education entry", 500);
  }
};

// Meta-data & Dashboard Endpoints

exports.incrementVisibility = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $inc: { visibilityCount: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json({
      message: "Visibility count incremented successfully.",
      visibilityCount: updatedCandidate.visibilityCount,
    });
  } catch (error) {
    handleError(res, error, "Failed to increment visibility count", 500);
  }
};

exports.markVerified = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { verifiedBadge: true } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }
    res.status(200).json({
      message: "Candidate profile marked as verified.",
      verifiedBadge: updatedCandidate.verifiedBadge,
    });
  } catch (error) {
    handleError(res, error, "Failed to mark profile as verified", 500);
  }
};

exports.getDashboardMainRoleCounts = async (req, res) => {
  try {
    const counts = await Candidate.aggregate([
      {
        $match: {
          "jobPreference.mainRole": {
            $in: [
              "Frontend Developer",
              "Backend Developer",
              "Full Stack Developer",
              "UI/UX Designer",
              "Project Manager",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$jobPreference.mainRole",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1,
        },
      },
      {
        $sort: { role: 1 },
      },
    ]);

    const allRoles = [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Project Manager",
    ];

    const finalCounts = allRoles.map((role) => {
      const found = counts.find((item) => item.role === role);
      return { role, count: found ? found.count : 0 };
    });

    res.status(200).json(finalCounts);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to retrieve candidate main role counts",
      500
    );
  }
};
