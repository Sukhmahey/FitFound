const Candidate = require("../models/CandidateModel");
const { calculateProfileScore } = require("../utils/scoringUtils");

const handleError = (res, error, message, status = 500) => {
  console.error(
    `[CandidateController] ${new Date().toISOString()} ${message}:`,
    error
  );
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

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

exports.getCandidateById = async (req, res) => {
  const { candidateId } = req.params;
  try {
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate profile", 500);
  }
};

exports.getCandidateByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const candidate = await Candidate.findOne({ userId }).lean();
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    console.log("[DEBUG] Candidate fetched (lean object):", candidate);
    console.log(
      "[DEBUG] Desired Job Title for Scoring:",
      candidate.jobPreference?.desiredJobTitle?.[0]
    );

    const desiredRoleForScoring = candidate.jobPreference?.desiredJobTitle?.[0];
    let profileScore = 0;
    if (desiredRoleForScoring) {
      profileScore = calculateProfileScore(candidate, desiredRoleForScoring);
    }

    console.log("[DEBUG] Calculated Profile Score:", profileScore);
    candidate.profileScore = profileScore;
    
    console.log(
      "[DEBUG] Candidate object BEFORE sending response (should contain profileScore):",
      candidate
    );

    res.status(200).json(candidate);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate profile", 500);
  }
};

exports.getAllCandidateProfiles = async (req, res) => {
  const {
    title,
    jobType,
    location,
    salaryFrom,
    salaryTo,
    jobDescriptionKeywords,
    workStatus,
    skills,
  } = req.query;

  let filter = {};

  if (title) {
    filter["jobPreference.desiredJobTitle"] = { $regex: title, $options: "i" };
  }

  if (jobType) {
    filter["jobPreference.jobType"] = jobType;
  }

  if (location) {
    filter["basicInfo.location"] = { $regex: location, $options: "i" };
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
    filter["basicInfo.bio"] = { $regex: jobDescriptionKeywords, $options: "i" };
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
    };
  }

  try {
    const candidateProfiles = await Candidate.find(filter).lean();

    const candidatesWithScores = candidateProfiles.map((candidate) => {
      const desiredRoleForScoring =
        candidate.jobPreference?.desiredJobTitle?.[0];
      let profileScore = 0;
      if (desiredRoleForScoring) {
        profileScore = calculateProfileScore(candidate, desiredRoleForScoring);
      }
      return { ...candidate, profileScore };
    });

    res.status(200).json(candidatesWithScores);
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
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    const desiredRoleForScoring =
      updatedCandidate.jobPreference?.desiredJobTitle?.[0];
    let profileScore = 0;
    if (desiredRoleForScoring) {
      profileScore = calculateProfileScore(
        updatedCandidate,
        desiredRoleForScoring
      );
    }
    updatedCandidate.profileScore = profileScore;

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
      { new: true, runValidators: true, lean: true }
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
          "basicInfo.location": updates.location,
        },
      },
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
        lean: true,
      }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or skill entry not found." });
    }
    const updatedEntry = updatedCandidate.skills.find(
      (s) => s._id.toString() === skillId
    );
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
      { new: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
        lean: true,
      }
    );

    if (!updatedCandidate) {
      return res.status(404).json({
        message: "Candidate profile or work history entry not found.",
      });
    }
    const updatedEntry = updatedCandidate.workHistory.find(
      (e) => e._id.toString() === entryId
    );
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
      { new: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
        lean: true,
      }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ message: "Candidate profile or education entry not found." });
    }
    const updatedEntry = updatedCandidate.education.find(
      (e) => e._id.toString() === entryId
    );
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
      { new: true, lean: true }
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

exports.incrementVisibility = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $inc: { visibilityCount: 1 } },
      { new: true, runValidators: true, lean: true }
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
      { new: true, runValidators: true, lean: true }
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
    // 1. Update rolesForDashboard to use lowercase for consistency
    const rolesForDashboard = [
      "frontend developer", // Changed to lowercase
      "backend developer",
      "full stack developer",
      "ui designer",
      "ux designer",
    ];

    const counts = await Candidate.aggregate([
      {
        // Unwind to deconstruct the array of desiredJobTitle
        $unwind: "$jobPreference.desiredJobTitle",
      },
      {
        // NEW: Convert the desiredJobTitle from the database to lowercase
        // This ensures case-insensitive matching with rolesForDashboard
        $addFields: {
          "jobPreference.desiredJobTitleLower": {
            $toLower: "$jobPreference.desiredJobTitle",
          },
        },
      },
      {
        // Filter the documents to include only the desired job titles (now case-insensitive)
        $match: {
          "jobPreference.desiredJobTitleLower": { $in: rolesForDashboard }, // Use the lowercase rolesForDashboard
        },
      },
      {
        // Group by the lowercase job title to count occurrences
        $group: {
          _id: "$jobPreference.desiredJobTitleLower", // Group by the lowercase version
          count: { $sum: 1 }, // Count the number of documents for each title
        },
      },
      {
        // Reshape the output document to rename _id to role
        $project: {
          _id: 0, // Exclude the default _id
          role: "$_id", // Rename _id to role
          count: 1, // Include the count
        },
      },
      {
        // Sort the results by role name
        $sort: { role: 1 },
      },
    ]);

    // Ensure all roles from rolesForDashboard are present, even if their count is 0
    const finalCounts = rolesForDashboard.map((role) => {
      const found = counts.find((item) => item.role === role);
      return { role, count: found ? found.count : 0 };
    });

    res.status(200).json(finalCounts);
  } catch (error) {
    console.error("Error fetching dashboard main role counts:", error); // Added error logging
    res.status(500).json({
      message: "Failed to fetch dashboard main role counts",
      error: error.message,
    });
  }
};
