const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    jobTitle: { type: String, minLength: 6, maxLength: 60 },
    jobDescription: { type: String, minLength: 12, maxLength: 300 },
    requiredSkills: [
      {
        skill: { type: String, minLength: 2, maxLength: 60 },
        yearsOfExperience: { type: Number, min: 0, validate: Number.isInteger },
        level: { type: String, enum: ["junior", "middle", "senior"] },
      },
    ],
    mustHaveCriteria: { type: String, minLength: 2, maxLength: 60 },
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
  },
  { timestamps: true, collection: "jobs" }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
