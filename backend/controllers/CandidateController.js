const Candidate = require("../models/CandidateModel"); 

const handleError = (res, error, message, status = 500) => {
  console.error(`${message}:`, error);
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",

    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

exports.getCandidateByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    console.log(
      `[getCandidateByUserId] Request initiated for userId: ${userId}`
    );
    const candidate = await Candidate.findOne({ userId }); // Find by the userId field
    if (!candidate) {
      console.log(
        `[getCandidateByUserId] Candidate not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found" });
    }
    console.log(`[getCandidateByUserId] Candidate found for userId: ${userId}`);
    res.status(200).json(candidate);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate profile", 500);
  }
};

exports.updateCandidateProfile = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    console.log(
      `[updateCandidateProfile] PATCH request received for userId: ${userId}`
    );
    console.log(`[updateCandidateProfile] Request body:`, updates);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: updates }, // Use $set to update only the fields provided in req.body
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedCandidate) {
      console.log(
        `[updateCandidateProfile] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    console.log(
      `[updateCandidateProfile] Candidate profile updated for userId: ${userId}`
    );
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

exports.updateSkills = async (req, res) => {
  const { userId } = req.params;
  const { skills } = req.body; // Expects an array of skill objects

  if (!Array.isArray(skills)) {
    console.log(`[updateSkills] Invalid request: 'skills' must be an array.`);
    return res
      .status(400)
      .json({ message: "Request body must contain a 'skills' array." });
  }

  try {
    console.log(`[updateSkills] PATCH request received for userId: ${userId}`);
    console.log(`[updateSkills] New skills array:`, skills);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { skills: skills } }, // Replace the entire skills array
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[updateSkills] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(`[updateSkills] Skills updated for userId: ${userId}`);
    res.status(200).json(updatedCandidate);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update skills",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateWorkHistory = async (req, res) => {
  const { userId } = req.params;
  const { workHistory } = req.body; // Expects an array of work history objects

  if (!Array.isArray(workHistory)) {
    console.log(
      `[updateWorkHistory] Invalid request: 'workHistory' must be an array.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain a 'workHistory' array." });
  }

  try {
    console.log(
      `[updateWorkHistory] PATCH request received for userId: ${userId}`
    );
    console.log(`[updateWorkHistory] New workHistory array:`, workHistory);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { workHistory: workHistory } }, // Replace the entire workHistory array
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[updateWorkHistory] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(
      `[updateWorkHistory] Work history updated for userId: ${userId}`
    );
    res.status(200).json(updatedCandidate);
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
  const newWorkEntry = req.body; // Expects a single work history object

  // Optional: Add more specific validation for the newWorkEntry structure here if needed
  if (!newWorkEntry || Object.keys(newWorkEntry).length === 0) {
    console.log(
      `[addWorkHistoryEntry] Invalid request: Empty body for new work entry.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain a new work history entry." });
  }

  try {
    console.log(
      `[addWorkHistoryEntry] POST request received for userId: ${userId}`
    );
    console.log(`[addWorkHistoryEntry] New work entry to add:`, newWorkEntry);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $push: { workHistory: newWorkEntry } }, // Add the new entry to the array
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[addWorkHistoryEntry] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(
      `[addWorkHistoryEntry] New work history entry added for userId: ${userId}`
    );
    res.status(201).json(updatedCandidate); // 201 Created for a new resource
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
  const { userId, workExpId } = req.params;
  const updates = req.body; // Contains fields to update for that specific entry

  if (!updates || Object.keys(updates).length === 0) {
    console.log(
      `[updateWorkEntryById] Invalid request: Empty body for work entry update.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    console.log(
      `[updateWorkEntryById] PATCH request received for userId: ${userId}, workExpId: ${workExpId}`
    );
    console.log(`[updateWorkEntryById] Updates for work entry:`, updates);

    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`workHistory.$[elem].${key}`] = updates[key];
      }
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId }, // Find the main candidate document
      { $set: updateOperation }, // Apply the constructed updates
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "elem._id": workExpId }], // Target the specific subdocument by its _id
      }
    );

    if (!updatedCandidate) {
      console.log(
        `[updateWorkEntryById] Candidate profile or work experience not found for userId: ${userId}, workExpId: ${workExpId}`
      );
      return res
        .status(404)
        .json({ message: "Candidate profile or work experience not found." });
    }
    // Check if the arrayFilters actually matched and updated an element
    // This isn't strictly necessary as findOneAndUpdate returns the whole doc,
    // but useful if you need to know if the subdoc was definitely found within the array.
    const updatedEntry = updatedCandidate.workHistory.id(workExpId);
    if (!updatedEntry) {
      console.log(
        `[updateWorkEntryById] Work experience with ID ${workExpId} not found within candidate ${userId}'s profile.`
      );
      return res
        .status(404)
        .json({
          message:
            "Work experience entry not found within the candidate's profile.",
        });
    }

    console.log(
      `[updateWorkEntryById] Work history entry updated for userId: ${userId}, workExpId: ${workExpId}`
    );
    res.status(200).json(updatedCandidate);
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
  const { userId, workExpId } = req.params;

  try {
    console.log(
      `[deleteWorkEntryById] DELETE request received for userId: ${userId}, workExpId: ${workExpId}`
    );

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $pull: { workHistory: { _id: workExpId } } }, // Remove elements matching the condition
      { new: true } // Return the updated document
    );

    if (!updatedCandidate) {
      console.log(
        `[deleteWorkEntryById] Candidate profile or work experience not found for userId: ${userId}, workExpId: ${workExpId}`
      );
      return res
        .status(404)
        .json({ message: "Candidate profile or work experience not found." });
    }
    // You could check if the length of the array changed to confirm deletion,
    // but the successful pull operation generally means it was removed if found.

    console.log(
      `[deleteWorkEntryById] Work history entry deleted for userId: ${userId}, workExpId: ${workExpId}`
    );
    res
      .status(200)
      .json({
        message: "Work experience entry deleted successfully.",
        candidate: updatedCandidate,
      });
    // Or res.status(204).send() for no content response
  } catch (error) {
    handleError(res, error, "Failed to delete work history entry", 500);
  }
};

exports.updateEducation = async (req, res) => {
  const { userId } = req.params;
  const { education } = req.body; // Expects an array of education objects

  if (!Array.isArray(education)) {
    console.log(
      `[updateEducation] Invalid request: 'education' must be an array.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain an 'education' array." });
  }

  try {
    console.log(
      `[updateEducation] PATCH request received for userId: ${userId}`
    );
    console.log(`[updateEducation] New education array:`, education);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { education: education } }, // Replace the entire education array
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[updateEducation] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(`[updateEducation] Education updated for userId: ${userId}`);
    res.status(200).json(updatedCandidate);
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
  const newEducationEntry = req.body; // Expects a single education object

  if (!newEducationEntry || Object.keys(newEducationEntry).length === 0) {
    console.log(
      `[addEducationEntry] Invalid request: Empty body for new education entry.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain a new education entry." });
  }

  try {
    console.log(
      `[addEducationEntry] POST request received for userId: ${userId}`
    );
    console.log(
      `[addEducationEntry] New education entry to add:`,
      newEducationEntry
    );

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $push: { education: newEducationEntry } }, // Add the new entry to the array
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[addEducationEntry] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(
      `[addEducationEntry] New education entry added for userId: ${userId}`
    );
    res.status(201).json(updatedCandidate);
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
  const { userId, educationId } = req.params;
  const updates = req.body; // Contains fields to update for that specific entry

  if (!updates || Object.keys(updates).length === 0) {
    console.log(
      `[updateEducationById] Invalid request: Empty body for education entry update.`
    );
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    console.log(
      `[updateEducationById] PATCH request received for userId: ${userId}, educationId: ${educationId}`
    );
    console.log(`[updateEducationById] Updates for education entry:`, updates);

    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`education.$[elem].${key}`] = updates[key];
      }
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $set: updateOperation },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "elem._id": educationId }],
      }
    );

    if (!updatedCandidate) {
      console.log(
        `[updateEducationById] Candidate profile or education entry not found for userId: ${userId}, educationId: ${educationId}`
      );
      return res
        .status(404)
        .json({ message: "Candidate profile or education entry not found." });
    }

    const updatedEntry = updatedCandidate.education.id(educationId);
    if (!updatedEntry) {
      console.log(
        `[updateEducationById] Education entry with ID ${educationId} not found within candidate ${userId}'s profile.`
      );
      return res
        .status(404)
        .json({
          message: "Education entry not found within the candidate's profile.",
        });
    }

    console.log(
      `[updateEducationById] Education entry updated for userId: ${userId}, educationId: ${educationId}`
    );
    res.status(200).json(updatedCandidate);
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
  const { userId, educationId } = req.params;

  try {
    console.log(
      `[deleteEducationById] DELETE request received for userId: ${userId}, educationId: ${educationId}`
    );

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      { $pull: { education: { _id: educationId } } },
      { new: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[deleteEducationById] Candidate profile or education entry not found for userId: ${userId}, educationId: ${educationId}`
      );
      return res
        .status(404)
        .json({ message: "Candidate profile or education entry not found." });
    }

    console.log(
      `[deleteEducationById] Education entry deleted for userId: ${userId}, educationId: ${educationId}`
    );
    res
      .status(200)
      .json({
        message: "Education entry deleted successfully.",
        candidate: updatedCandidate,
      });
    // Or res.status(204).send() for no content
  } catch (error) {
    handleError(res, error, "Failed to delete education entry", 500);
  }
};

exports.incrementVisibility = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log(
      `[incrementVisibility] PATCH request received for userId: ${userId}`
    );

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $inc: { visibilityCount: 1 } }, // Increment visibilityCount by 1
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[incrementVisibility] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(
      `[incrementVisibility] Visibility count incremented for userId: ${userId}. New count: ${updatedCandidate.visibilityCount}`
    );
    res
      .status(200)
      .json({
        message: "Visibility count incremented successfully.",
        candidate: updatedCandidate,
      });
  } catch (error) {
    handleError(res, error, "Failed to increment visibility count", 500);
  }
};

exports.markVerified = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log(`[markVerified] PATCH request received for userId: ${userId}`);

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { verifiedBadge: true } }, // Set verifiedBadge to true
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      console.log(
        `[markVerified] Candidate profile not found for userId: ${userId}`
      );
      return res.status(404).json({ message: "Candidate profile not found." });
    }

    console.log(
      `[markVerified] Candidate profile marked as verified for userId: ${userId}`
    );
    res
      .status(200)
      .json({
        message: "Candidate profile marked as verified.",
        candidate: updatedCandidate,
      });
  } catch (error) {
    handleError(res, error, "Failed to mark profile as verified", 500);
  }
};
