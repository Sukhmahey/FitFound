const EmployerProfile = require("../models/EmployerProfileModel");

const handleError = (res, error, message, status = 500) => {
  console.error(`[EmployerProfileController] ${message}:`, error);
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

exports.getAllEmployerProfiles = async (req, res) => {
  try {
    const employers = await EmployerProfile.find();
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employers", error: err.message });
  }
};

exports.createEmployerProfile = async (req, res) => {
  const { userId } = req.params;
  const profileData = req.body;

  try {
    const existingProfile = await EmployerProfile.findOne({ userId });
    if (existingProfile) {
      return res
        .status(409)
        .json({
          message: `Employer profile already exists for user ID: ${userId}`,
        });
    }

    const newEmployerProfile = new EmployerProfile({
      userId,
      ...profileData,
    });

    const savedProfile = await newEmployerProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to create employer profile",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.getEmployerProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const employerProfile = await EmployerProfile.findOne({ userId });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: `Employer profile not found for user ID: ${userId}` });
    }

    res.status(200).json(employerProfile);
  } catch (error) {
    handleError(res, error, "Failed to fetch employer profile", 500);
  }
};

exports.updateEmployerProfile = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must contain fields to update." });
  }

  try {
    const updatedProfile = await EmployerProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ message: `Employer profile not found for user ID: ${userId}` });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update employer profile",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateEmployerLogo = async (req, res) => {
  const { userId } = req.params;
  const { companyLogo } = req.body;

  if (!companyLogo) {
    return res
      .status(400)
      .json({ message: "Request body must contain 'companyLogo' field." });
  }

  try {
    const updatedProfile = await EmployerProfile.findOneAndUpdate(
      { userId },
      { $set: { companyLogo: companyLogo } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ message: `Employer profile not found for user ID: ${userId}` });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update company logo",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.updateEmployerContactInfo = async (req, res) => {
  const { userId } = req.params;
  const contactUpdates = req.body;

  if (!contactUpdates || Object.keys(contactUpdates).length === 0) {
    return res
      .status(400)
      .json({
        message: "Request body must contain contact information to update.",
      });
  }

  const setUpdates = {};
  for (const key in contactUpdates) {
    if (Object.prototype.hasOwnProperty.call(contactUpdates, key)) {
      setUpdates[`contactInfo.${key}`] = contactUpdates[key];
    }
  }

  try {
    const updatedProfile = await EmployerProfile.findOneAndUpdate(
      { userId },
      { $set: setUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ message: `Employer profile not found for user ID: ${userId}` });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to update contact information",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

exports.deleteEmployerProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedProfile = await EmployerProfile.findOneAndDelete({ userId });

    if (!deletedProfile) {
      return res
        .status(404)
        .json({ message: `Employer profile not found for user ID: ${userId}` });
    }

    res.status(200).json({ message: "Employer profile deleted successfully." });
  } catch (error) {
    handleError(res, error, "Failed to delete employer profile", 500);
  }
};
