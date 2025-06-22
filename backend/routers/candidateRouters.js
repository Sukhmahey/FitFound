const express = require("express");
const router = express.Router();
const controller = require("../controllers/CandidateController");

router.get("/test", (req, res) => res.send("Candidate route test passed"));


router.get("/:userId", controller.getCandidateByUserId);
router.patch("/:userId", controller.updateCandidateProfile);

router.patch("/:userId/skills", controller.updateSkills);

router.patch("/:userId/work-history", controller.updateWorkHistory);
router.post("/:userId/work-history", controller.addWorkHistoryEntry);
router.patch(
  "/:userId/work-history/:workExpId",
  controller.updateWorkEntryById
);
router.delete(
  "/:userId/work-history/:workExpId",
  controller.deleteWorkEntryById
);

router.patch("/:userId/education", controller.updateEducation);
router.post("/:userId/education", controller.addEducationEntry);
router.patch("/:userId/education/:educationId", controller.updateEducationById);
router.delete(
  "/:userId/education/:educationId",
  controller.deleteEducationById
);

router.patch("/:userId/visibility", controller.incrementVisibility);
router.patch("/:userId/verified", controller.markVerified);



router.get("/main-role-counts", controller.getDashboardMainRoleCounts);


module.exports = router;
