const SearchAppearance = require("../models/SearchAppearance");
const mongoose = require("mongoose");

// NEW, SIMPLE FUNCTION TO LOG THE DATA YOU SEND
exports.logAppearance = async (req, res) => {
  try {
    // It takes the candidateId, employerId, and skills directly from the request body
    const { candidateId, employerId, skills } = req.body;

    // Basic validation
    if (!candidateId || !employerId || !skills || !Array.isArray(skills)) {
      return res
        .status(400)
        .json({
          message:
            "candidateId, employerId, and skills (as an array) are required.",
        });
    }

    // Create the new document with the data you provided
    const newAppearance = new SearchAppearance({
      candidateId: candidateId,
      employerId: employerId,
      searchQuery: skills.map((s) => s.toLowerCase()),
    });

    // Save it to the database
    await newAppearance.save();

    res.status(201).json({
      message: "Appearance logged successfully.",
      data: newAppearance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// This function gets the data for the line chart
exports.getVisibilityTimeline = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    const timeline = [];
    const numberOfDays = 10;
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      const appearances = await SearchAppearance.countDocuments({
        candidateId: new mongoose.Types.ObjectId(candidateId),
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
      timeline.unshift({
        date: startOfDay.toISOString().split("T")[0],
        appearances,
      });
    }
    res.status(200).json(timeline);
  } catch (error) {
    console.error("Error in getVisibilityTimeline:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// This function gets the data for the circle charts
exports.getSkillBreakdown = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    // Get all unique skills associated with this candidate's appearances
    const candidateAppearancesRaw = await SearchAppearance.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
    }).select("searchQuery");

    if (!candidateAppearancesRaw.length) {
      return res.status(200).json([]); // No appearances for this candidate
    }

    // Extract all unique skills from these appearances
    const uniqueSkills = [
      ...new Set(candidateAppearancesRaw.flatMap((app) => app.searchQuery)),
    ];

    const skillBreakdown = [];

    for (const skill of uniqueSkills) {
      // Calculate how many times THIS CANDIDATE appeared in searches that included this specific skill.
      // This is the number of distinct SearchAppearance documents where candidateId matches
      // AND the searchQuery array contains the current skill.
      const candidateAppearancesCount = await SearchAppearance.countDocuments({
        candidateId: new mongoose.Types.ObjectId(candidateId),
        searchQuery: skill, // Checks if the array contains this skill
      });

      // Calculate the total number of searches on the platform that included this specific skill.
      const totalPlatformSearches = await SearchAppearance.countDocuments({
        searchQuery: skill, // Checks if the array contains this skill
      });

      if (candidateAppearancesCount > 0) {
        // Only add if the candidate actually appeared for this skill
        skillBreakdown.push({
          skill,
          candidateAppearances: candidateAppearancesCount,
          totalPlatformSearches,
        });
      }
    }

    // Sort by candidateAppearances in descending order
    skillBreakdown.sort(
      (a, b) => b.candidateAppearances - a.candidateAppearances
    );

    res.status(200).json(skillBreakdown);
  } catch (error) {
    console.error("Error in getSkillBreakdown:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logBulkAppearance = async (req, res) => {
  try {
    // The request body now expects an array of candidateIds
    const { employerId, skills, candidateIds } = req.body;

    if (
      !employerId ||
      !skills ||
      !Array.isArray(skills) || // Ensure skills is an array
      !candidateIds ||
      !Array.isArray(candidateIds) ||
      candidateIds.length === 0
    ) {
      return res.status(400).json({
        message:
          "employerId, skills (as an array), and a non-empty candidateIds array are required.",
      });
    }

    // Create the array of documents to be saved
    const searchLogPayload = candidateIds.map((id) => ({
      candidateId: id,
      employerId: employerId,
      searchQuery: skills.map((s) => s.toLowerCase()),
    }));

    // Save all documents in one efficient database operation
    await SearchAppearance.insertMany(searchLogPayload);

    res.status(201).json({
      message: `Successfully logged appearances for ${candidateIds.length} candidates.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
