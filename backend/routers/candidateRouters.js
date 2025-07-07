const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/CandidateController");

// General Profile Endpoints
router.post("/", candidateController.createCandidateProfile);
router.get("/user/:userId", candidateController.getCandidateByUserId);
router.get("/candidate/:candidateId", candidateController.getCandidateById);
router.get("/", candidateController.getAllCandidateProfiles);
router.patch("/:userId", candidateController.updateCandidateProfile);
router.delete("/:userId", candidateController.deleteCandidateProfile);

// Nested Object Update Endpoints
router.patch("/:userId/personal-info", candidateController.updatePersonalInfo);
router.patch("/:userId/basic-info", candidateController.updateBasicInfo);
router.patch("/:userId/portfolio", candidateController.updatePortfolio);
router.patch(
  "/:userId/job-preference",
  candidateController.updateJobPreference
);

// Skills Endpoints
router.patch("/:userId/skills", candidateController.updateSkills);
router.post("/:userId/skills/add", candidateController.addSkillEntry);
router.patch(
  "/:userId/skills/:skillId",
  candidateController.updateSkillEntryById
);
router.delete(
  "/:userId/skills/:skillId",
  candidateController.deleteSkillEntryById
);

// Work History Endpoints
router.patch("/:userId/work-history", candidateController.updateWorkHistory);
router.post(
  "/:userId/work-history/add",
  candidateController.addWorkHistoryEntry
);
router.patch(
  "/:userId/work-history/:entryId",
  candidateController.updateWorkEntryById
);
router.delete(
  "/:userId/work-history/:entryId",
  candidateController.deleteWorkEntryById
);

// Education Endpoints
router.patch("/:userId/education", candidateController.updateEducation);
router.post("/:userId/education/add", candidateController.addEducationEntry);
router.patch(
  "/:userId/education/:entryId",
  candidateController.updateEducationById
);
router.delete(
  "/:userId/education/:entryId",
  candidateController.deleteEducationById
);

// Meta-data & Dashboard Endpoints
router.patch(
  "/:userId/visibility/increment",
  candidateController.incrementVisibility
);
router.patch("/:userId/verify", candidateController.markVerified);
router.get(
  "/dashboard-main-role-counts",
  candidateController.getDashboardMainRoleCounts
);

module.exports = router;
