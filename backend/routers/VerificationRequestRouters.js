const express = require("express");

const router = express.Router();

const verificationRequestController = require("../controllers/VerificationRequestController");

router.post("/", verificationRequestController.createVerificationRequest);

router.get(
  "/employer/:employerProfileId",
  verificationRequestController.getVerificationRequestsForEmployer
);

router.patch(
  "/:requestId",
  verificationRequestController.updateVerificationRequestStatus
);

module.exports = router;
