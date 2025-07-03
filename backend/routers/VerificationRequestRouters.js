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

router.get(
  "/candidate/:candidateId",
  verificationRequestController.getVerificationRequestsForCandidate
);

module.exports = router;
