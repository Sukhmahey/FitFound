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
    },

    employmentDates: {
      startDate: {
        type: String,
        match: /^(0[1-9]|1[0-2])-(\d{4})$/,
        trim: true,
        required: true,
      },

      endDate: {
        type: Date,
        type: String,
        match: /^(0[1-9]|1[0-2])-(\d{4})$/,
        trim: true,
      },
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
