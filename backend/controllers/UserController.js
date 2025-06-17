const User = require("../models/UserModel");
const Candidate = require("../models/CandidateModel");

const saveUser = async (req, res) => {
  const { email, idFirebaseUser, role, companyName, companyDescription } =
    req.body;

  try {
    const newUser = new User({
      email,
      idFirebaseUser,
      role,
      ...(role === "employer" && {
        companyName,
        companyDescription,
      }),
    });

    console.log("body of the user in the backend", req.body);

    const savedUser = await newUser.save();

    if (role === "candidate") {
      const newCandidate = new Candidate(); // empty doc
      await newCandidate.save();
    }

    res.status(201).json({
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      ...(role === "employer"
        ? {
            companyName: savedUser.companyName,
            companyDescription: savedUser.companyDescription,
          }
        : {}),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ userId: null, message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      role: user.role,
      ...(user.role === "employer"
        ? {
            companyName: user.companyName,
            companyDescription: user.companyDescription,
          }
        : {}),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { saveUser, getUserByEmail };
