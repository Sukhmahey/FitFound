const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InteractionSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate", // References the Candidate model
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job", // References the Job model (specific job posting)
      required: true,
    },

    shortlisted: { type: Boolean, default: false },
    outreachMessage: { type: String, minLength: 12, maxLength: 500 }, // Employer's initial message

    candidateConsentToReveal: {
      // Tracks if candidate has granted permission for full profile view
      type: Boolean,
      default: false,
    },
    consentGivenAt: { type: Date },

    // Interview stage tracking
    interview: {
      status: {
        type: String,
        enum: ["none", "pending", "scheduled", "completed", "cancelled"],
        default: "none",
      },
      method: { type: String, enum: ["phone", "video", "in-person", "onsite"] }, // Added 'onsite'
      dateTime: { type: Date },
      notes: { type: String, maxLength: 500, trim: true }, // Internal notes about the interview
      platformLink: { type: String, trim: true }, // Link for video calls
    },

    finalStatus: {
      type: String,
      enum: ["none", "hired", "rejected", "withdrawn"],
      default: "none",
    },

    fullProfileViewedByEmployer: { type: Boolean, default: false },
    fullProfileViewedAt: { type: Date },
  },
  { timestamps: true, collection: "interactions" } // createdAt, updatedAt
);

const Interaction = mongoose.model("Interaction", InteractionSchema);
module.exports = Interaction;
