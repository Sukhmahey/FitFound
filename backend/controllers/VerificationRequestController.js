const VerificationRequest = require("../models/VerificationRequestModel");



exports.createVerificationRequest = async (req, res) => {
  try {
    const { candidateId, employerProfileId, position, employmentDates } =
      req.body;

    if (!candidateId || !employerProfileId || !position || !employmentDates) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newRequest = new VerificationRequest({
      candidateId,

      employerProfileId,

      position,

      employmentDates,

      status: "pending",
    });

    const savedRequest = await newRequest.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error creating verification request:", error);

    res.status(500).json({
      message: "Failed to create verification request",

      error: error.message,
    });
  }
};

exports.getVerificationRequestsForEmployer = async (req, res) => {
  try {
    const { employerProfileId } = req.params;

    const { status } = req.query;

    const query = { employerProfileId };

    if (status) {
      query.status = status;
    }

    const requests = await VerificationRequest.find(query)

      .populate({
        path: "candidateId",

        model: "Candidate",

        select:
          "personalInfo.firstName personalInfo.lastName personalInfo.email basicInfo.profilePicture",
      })

      .exec();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching verification requests:", error);

    res.status(500).json({
      message: "Failed to fetch verification requests",

      error: error.message,
    });
  }
};

exports.updateVerificationRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    const { status, declineReason } = req.body;

    if (!["verified", "declined"].includes(status)) {
      return res
        .status(400)
        .json({
          message: "Invalid status provided. Must be 'verified' or 'declined'.",
        });
    }

    const updateData = {
      status,

      actionDate: new Date(),
    };

    if (status === "declined") {
      updateData.declineReason = declineReason;
    }

    const updatedRequest = await VerificationRequest.findByIdAndUpdate(
      requestId,

      updateData,

      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ message: "Verification request not found." });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating verification request status:", error);

    res.status(500).json({
      message: "Failed to update verification request status",

      error: error.message,
    });
  }
};

