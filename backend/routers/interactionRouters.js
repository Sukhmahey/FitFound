

const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/InteractionController");

// --- General Interaction Management ---

// POST: Employer initiates an interaction (sends outreach)
// Body: { candidateId, employerId, jobId, outreachMessage }
router.post("/", interactionController.createInteraction);

// GET: Get a specific interaction by its ID (for detailed view by either party)
router.get("/:interactionId", interactionController.getInteractionById);

// DELETE: Delete an interaction (useful for cleanup or admin)
router.delete("/:interactionId", interactionController.deleteInteraction);

// --- Candidate-Specific Interactions ---

// GET: Get all interactions for a specific candidate (Candidate's "Connections" dashboard)
// Query params: ?status=pending|accepted|archived (optional)
router.get(
  "/candidate/:candidateId",
  interactionController.getInteractionsByCandidateId
);

// PATCH: Candidate updates their consent to reveal profile (Accept/Decline)
// Body: { consent: true/false }
router.patch(
  "/:interactionId/consent",
  interactionController.updateCandidateConsent
);

// --- Employer-Specific Interactions ---

// GET: Get all interactions initiated by a specific employer
// Query params: ?status=active|concluded (optional)
router.get(
  "/employer/:employerId",
  interactionController.getInteractionsByEmployerId
);

// --- Update Specific Interaction Details ---

// PATCH: Update interview details within an interaction
// Body: { status, method, dateTime, notes, platformLink }
router.patch(
  "/:interactionId/interview",
  interactionController.updateInterviewDetails
);

// PATCH: Update the final status of an interaction (hired, rejected, withdrawn)
// Body: { status: 'hired'|'rejected'|'withdrawn' }
router.patch(
  "/:interactionId/final-status",
  interactionController.updateFinalStatus
);

// Test route to verify the router is working
router.get("/test", (req, res) => res.send("Interaction router test passed"));

module.exports = router;
