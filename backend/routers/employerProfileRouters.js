const express = require("express");
const router = express.Router();
const employerProfileController = require("../controllers/EmployerProfileController");

router.get("/", employerProfileController.getAllEmployerProfiles);
router.post(
  "/:userId/profile",
  employerProfileController.createEmployerProfile
);
router.get(
  "/:userId/profile",
  employerProfileController.getEmployerProfileByUserId
);
router.patch(
  "/:userId/profile",
  employerProfileController.updateEmployerProfile
);
router.patch(
  "/:userId/profile/logo",
  employerProfileController.updateEmployerLogo
);
router.patch(
  "/:userId/profile/contact",
  employerProfileController.updateEmployerContactInfo
);
router.delete(
  "/:userId/profile",
  employerProfileController.deleteEmployerProfile
);

router.get("/test", (req, res) =>
  res.send("Employer Profile router test passed")
);

module.exports = router;
