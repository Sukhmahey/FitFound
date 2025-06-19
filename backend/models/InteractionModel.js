const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InteractionSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    sourceJobFormId: { type: Schema.Types.ObjectId, ref: "Job" },

    shortlisted: { type: Boolean, default: false },
    outreachMessage: { type: String, minLength: 12, maxLength: 300 },

    interview: {
      status: {
        type: String,
        enum: ["none", "pending", "scheduled", "completed"],
        default: "none",
      },
      method: { type: String, enum: ["phone", "video", "in-person"] },
      dateTime: { type: Date },
    },

    finalStatus: {
      type: String,
      enum: ["none", "hired", "rejected"],
      default: "none",
    },
  },
  { timestamps: true, collection: "interactions" }
);

const Interaction = mongoose.model("Interaction", InteractionSchema);
module.exports = Interaction;
