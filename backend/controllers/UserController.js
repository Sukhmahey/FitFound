// backend/controllers/UserController.js

const User = require("../models/UserModel");
const Candidate = require("../models/CandidateModel");
const EmployerProfile = require("../models/EmployerProfileModel");

const handleError = (res, error, message, status = 500) => {
  console.error(
    `[UserController] ${new Date().toISOString()} ${message}:`,
    error
  );
  res.status(status).json({
    error: message,
    details: error.message || "Server Error",
    ...(error.name === "ValidationError" && { validationErrors: error.errors }),
  });
};

const saveUser = async (req, res) => {
  const { email, idFirebaseUser, role, companyName, companyDescription } =
    req.body;

  try {
    const newUser = new User({
      email,
      idFirebaseUser,
      role,
    });

    console.log("body of the user in the backend", req.body);

    const savedUser = await newUser.save();

    let profileId = null;

    if (role === "candidate") {
      const newCandidate = new Candidate({ userId: savedUser._id });
      const savedCandidate = await newCandidate.save();
      profileId = savedCandidate._id;
    }

    return res.status(201).json({
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      profileId: profileId,
    });
  } catch (error) {
    if (error.code === 11000) {
      let field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res
        .status(409)
        .json({
          error: `The ${field} '${value}' is already in use.`,
          details: error.message,
        });
    }
    handleError(
      res,
      error,
      "Failed to save user",
      error.name === "ValidationError" ? 400 : 500
    );
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ userId: null, message: "User not found" });
    }

    let profileId = null;
    let profileSpecificData = {};

    if (user.role === "employer") {
      const employerProfile = await EmployerProfile.findOne({
        userId: user._id,
      });
      if (employerProfile) {
        profileId = employerProfile._id;
        profileSpecificData.companyName = employerProfile.companyName;
        profileSpecificData.companyDescription =
          employerProfile.companyDescription;
      }
    } else if (user.role === "candidate") {
      const candidateProfile = await Candidate.findOne({ userId: user._id });
      if (candidateProfile) {
        profileId = candidateProfile._id;
      }
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      role: user.role,
      profileId: profileId,
      ...profileSpecificData,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch user by email", 500);
  }
};

module.exports = { saveUser, getUserByEmail };
