const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobTitle: { type: String, minLength: 6, maxLength: 60 },
    jobDescription: { type: String, minLength: 12},
    requiredSkills: [
      {
        skill: { type: String, minLength: 2, maxLength: 60 },
      },
    ],
    mustHaveCriteria: { type: String },
    salaryRange: {
      min: { type: Number, min: 0, validate: Number.isInteger },
      max: { type: Number, min: 0, validate: Number.isInteger },
      perHour: { type: Boolean, default: false },
      perYear: { type: Boolean, default: false },
    },
    location: { type: String, minLength: 2, maxLength: 60 },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
    },
    workEnvironment: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      trim: true,
    },

    requiredWorkAuthorization: {
      type: [String], // Array of strings
      enum: ["Work Permit", "Study Permit", "PR Citizen"],

      required: true, // Making this required for clarity on job postings
    },
  },
  { timestamps: true, collection: "jobs" }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
