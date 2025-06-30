const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VerificationRequestSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      required: true,
    },

    employerProfileId: {
      type: Schema.Types.ObjectId,

      ref: "EmployerProfile",

      required: true,
    },

    position: {
      type: String,

      trim: true,

      required: true,
    },

    employmentDates: {
      startDate: { type: Date, required: true },

      endDate: { type: Date },
    },

    status: {
      type: String,

      enum: ["pending", "verified", "declined"],

      default: "pending",
    },

    declineReason: {
      type: String,

      trim: true,
    },

    actionDate: {
      type: Date,
    },
  },

  {
    timestamps: true,

    collection: "verificationRequests",
  }
);

const VerificationRequest = mongoose.model(
  "VerificationRequest",

  VerificationRequestSchema
);

module.exports = VerificationRequest;
