// backend/controllers/InteractionController.js

const Interaction = require("../models/InteractionModel");
const Candidate = require("../models/CandidateModel");

const handleError = (res, error, message, status = 500) => {
  console.error(
    `[InteractionController] ${new Date().toISOString()} ${message}:`,
    error
  );
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

exports.createInteraction = async (req, res) => {
  const { candidateId, employerId, jobId, outreachMessage } = req.body;

  try {
    const existingInteraction = await Interaction.findOne({
      candidateId,
      employerId,
      jobId,
      finalStatus: "none", // Checks for an *active* interaction
    });

    if (existingInteraction) {
      return res.status(409).json({
        message:
          "An active interaction already exists for this candidate and job.",
      });
    }

    const newInteraction = new Interaction({
      candidateId,
      employerId,
      jobId,
      outreachMessage,
      shortlisted: true, 
    });

    const savedInteraction = await newInteraction.save();
    res.status(201).json(savedInteraction);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to create new interaction",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.getInteractionById = async (req, res) => {
  const { interactionId } = req.params;
  try {
    const interaction = await Interaction.findById(interactionId)
      .populate("candidateId", "personalInfo basicInfo skills jobPreference")
      .populate("employerId", "companyName")
      .populate("jobId", "jobTitle location salaryRange");

    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found." });
    }


    let candidateDataForResponse = interaction.candidateId.toObject();
    if (!interaction.candidateConsentToReveal) {
      candidateDataForResponse = {
        _id: candidateDataForResponse._id,
        userId: candidateDataForResponse.userId,
        basicInfo: {
          bio: candidateDataForResponse.basicInfo?.bio,
        },
        skills: candidateDataForResponse.skills,
        workHistory: candidateDataForResponse.workHistory,
        portfolio: candidateDataForResponse.portfolio,
        education: candidateDataForResponse.education,
        jobPreference: candidateDataForResponse.jobPreference,
      };
      delete candidateDataForResponse.personalInfo;
      delete candidateDataForResponse.basicInfo.phoneNumber;
      delete candidateDataForResponse.basicInfo.language;
    }

    const responseInteraction = interaction.toObject();
    responseInteraction.candidateProfile = candidateDataForResponse;
    delete responseInteraction.candidateId;

    res.status(200).json(responseInteraction);
  } catch (error) {
    handleError(res, error, "Failed to fetch interaction", 500);
  }
};


exports.getAllInteractions = async (req, res) => {
  try {
    // Destructure all expected query parameters
    const {
      finalStatus,
      employerId,
      candidateId,
      shortlisted,
      interviewStatus,
    } = req.query;

    let filter = {}; // Build dynamic filter object

    // Apply finalStatus filter
    if (finalStatus) {
      filter.finalStatus = finalStatus;
    }
    // Apply employerId filter
    if (employerId) {
      filter.employerId = employerId;
    }
    // Apply candidateId filter
    if (candidateId) {
      filter.candidateId = candidateId;
    }
    // Apply shortlisted filter (convert string 'true'/'false' to boolean)
    if (shortlisted !== undefined) {
      filter.shortlisted = shortlisted === "true";
    }
    // Apply nested interview status filter
    if (interviewStatus) {
      filter["interview.status"] = interviewStatus;
    }

    const interactions = await Interaction.find(filter)
      // Populate essential related data for context
      .populate(
        "candidateId",
        "personalInfo.firstName personalInfo.lastName personalInfo.email"
      ) // Get basic candidate info
      .populate("employerId", "companyName") // Get employer's company name
      .populate("jobId", "jobTitle") // Get the job title
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .lean(); // Use .lean() for faster query performance when not modifying returned documents

    // Return 200 OK with an empty array if no interactions match the filters
    res.status(200).json(interactions);
  } catch (error) {
    handleError(res, error, "Failed to fetch interactions", 500);
  }
};

exports.getInteractionsByCandidateId = async (req, res) => {
  const { candidateId } = req.params;
  const { status } = req.query;

  let filter = { candidateId };
  if (status === "pending") {
    filter.candidateConsentToReveal = false;
    filter["interview.status"] = "none";
    filter.finalStatus = "none";
  } else if (status === "accepted") {
    filter.candidateConsentToReveal = true;
    filter.finalStatus = "none";
  } else if (status === "archived") {
    filter.$or = [
      {
        candidateConsentToReveal: false,
        "interview.status": { $in: ["cancelled"] },
      },
      { finalStatus: { $in: ["hired", "rejected", "withdrawn"] } },
    ];
  } else {
    filter.finalStatus = { $ne: "withdrawn" }; // Default for candidate, exclude 'withdrawn' from default view
  }

  try {
    const interactions = await Interaction.find(filter)
      .populate(
        "employerId",
        "companyName companyDescription contactInfo"
      )
      .populate("jobId", "jobTitle location salaryRange jobType")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(interactions);
  } catch (error) {
    handleError(res, error, "Failed to fetch candidate interactions", 500);
  }
};

exports.getInteractionsByEmployerId = async (req, res) => {
  const { employerId } = req.params;
  const { status, consentStatus } = req.query; 
  let filter = { employerId };
  if (status === "active") {

    filter.finalStatus = { $in: ["none"] }; 
    filter["interview.status"] = {
      $in: ["none", "pending", "scheduled", "completed"],
    }; // Include all active interview stages
  } else if (status === "concluded") {
    filter.finalStatus = { $in: ["hired", "rejected", "withdrawn"] };
  }


  if (consentStatus === "accepted") {

    filter.candidateConsentToReveal = true;
  } else if (consentStatus === "pending") {
    
    filter.candidateConsentToReveal = false; 
  } 

  try {
    const interactions = await Interaction.find(filter)
      .populate("candidateId", "personalInfo basicInfo skills jobPreference")
      .populate("jobId", "jobTitle location salaryRange")
      .sort({ updatedAt: -1 })
      .lean();

    const interactionsWithAnonymizedCandidates = interactions.map(
      (interaction) => {
        let candidateDataForResponse = interaction.candidateId;

        if (!interaction.candidateConsentToReveal) {
          candidateDataForResponse = {
            _id: candidateDataForResponse._id,
            userId: candidateDataForResponse.userId,
            basicInfo: {
              bio: candidateDataForResponse.basicInfo?.bio,
            },
            skills: candidateDataForResponse.skills,
            workHistory: candidateDataForResponse.workHistory,
            portfolio: candidateDataForResponse.portfolio,
            education: candidateDataForResponse.education,
            jobPreference: candidateDataForResponse.jobPreference,
            profileScore: candidateDataForResponse.profileScore, 
          };
          delete candidateDataForResponse.personalInfo;
          delete candidateDataForResponse.basicInfo.phoneNumber;
          delete candidateDataForResponse.basicInfo.language;
        }

        const responseInteraction = { ...interaction };
        responseInteraction.candidateProfile = candidateDataForResponse;
        delete responseInteraction.candidateId;

        return responseInteraction;
      }
    );

    res.status(200).json(interactionsWithAnonymizedCandidates);
  } catch (error) {
    handleError(res, error, "Failed to fetch employer interactions", 500);
  }
};

exports.updateCandidateConsent = async (req, res) => {
  const { interactionId } = req.params;
  const { consent } = req.body;

  if (typeof consent !== "boolean") {
    return res
      .status(400)
      .json({ message: "Request body must contain 'consent' as a boolean." });
  }

  try {
    const update = { candidateConsentToReveal: consent };
    if (consent === true) {
      update.consentGivenAt = new Date();
    }


    if (consent === false) {
      update.finalStatus = "withdrawn";
    }

    const updatedInteraction = await Interaction.findByIdAndUpdate(
      interactionId,
      { $set: update },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedInteraction) {
      return res.status(404).json({ message: "Interaction not found." });
    }

    res.status(200).json(updatedInteraction);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update candidate consent",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateInterviewDetails = async (req, res) => {
  const { interactionId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({
      message: "Request body must contain interview fields to update.",
    });
  }

  try {
    const updateOperation = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateOperation[`interview.${key}`] = updates[key];
      }
    }

    const updatedInteraction = await Interaction.findByIdAndUpdate(
      interactionId,
      { $set: updateOperation },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedInteraction) {
      return res.status(404).json({ message: "Interaction not found." });
    }

    res.status(200).json(updatedInteraction.interview); 
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update interview details",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateFinalStatus = async (req, res) => {
  const { interactionId } = req.params;
  const { status } = req.body;

  if (!status || !["hired", "rejected", "withdrawn"].includes(status)) {
    return res.status(400).json({ message: "Invalid final status provided." });
  }

  try {
    const updatedInteraction = await Interaction.findByIdAndUpdate(
      interactionId,
      { $set: { finalStatus: status } },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedInteraction) {
      return res.status(404).json({ message: "Interaction not found." });
    }

    res.status(200).json(updatedInteraction);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update final status",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteInteraction = async (req, res) => {
  const { interactionId } = req.params;
  try {
    const deletedInteraction = await Interaction.findByIdAndDelete(
      interactionId
    );
    if (!deletedInteraction) {
      return res.status(404).json({ message: "Interaction not found." });
    }
    res.status(200).json({ message: "Interaction deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete interaction", 500);
  }
};
