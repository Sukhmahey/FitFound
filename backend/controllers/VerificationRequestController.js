const VerificationRequest = require("../models/VerificationRequestModel");
const EmployerProfile = require("../models/EmployerProfileModel");

exports.createVerificationRequest = async (req, res) => {
  try {
    const { candidateId, companyName, startDate, endDate, position } = req.body;

    if (!candidateId || !companyName || !startDate || !endDate) {
      return res.status(400).json({
        message:
          "Missing required fields: candidateId, companyName, startDate, endDate.",
      });
    }

    const employer = await EmployerProfile.findOne({
      companyName: companyName,
    });

    if (!employer) {
      return res.status(404).json({
        message: `Employer with company name "${companyName}" not found.`,
      });
    }

    const newRequest = new VerificationRequest({
      candidateId,
      employerProfileId: employer._id,
      position: position, // Now directly using 'position' from req.body
      employmentDates: { startDate, endDate },
      status: "pending",
    });

    const savedRequest = await newRequest.save();

    console.log(
      `[createVerificationRequest] New verification request created for employer ${employer.companyName}.`
    );

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
    // Changed 'role' to 'position' here
    const { is_verified, position, declineReason, companyName } = req.body;

    const updateData = {
      actionDate: new Date(),
    };

    if (companyName) {
      const employer = await EmployerProfile.findOne({
        companyName: companyName,
      });
      if (!employer) {
        return res.status(404).json({
          message: `Employer with company name "${companyName}" not found. Cannot update employer ID.`,
        });
      }
      updateData.employerProfileId = employer._id;
    }

    if (is_verified !== undefined) {
      let newStatus;
      if (is_verified === true) {
        newStatus = "verified";
      } else if (is_verified === false) {
        newStatus = "declined";
      } else {
        return res.status(400).json({
          message: "Invalid 'is_verified' value. Must be true or false.",
        });
      }
      updateData.status = newStatus;

      if (newStatus === "declined") {
        updateData.declineReason = declineReason;
      } else {
        updateData.declineReason = null;
      }
    }

    // Now checking for 'position' directly
    if (position !== undefined) {
      updateData.position = position; // Directly using 'position' from req.body
    }

    if (Object.keys(updateData).length === 1 && updateData.actionDate) {
      return res.status(400).json({
        message:
          "No valid fields provided for update (status, position, companyName).",
      });
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
      message: "Failed to update verification request",
      error: error.message,
    });
  }
};
