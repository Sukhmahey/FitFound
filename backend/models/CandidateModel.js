const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    skills: [
      {
        skill: { type: String, minLength: 2, maxLength: 60 },
        yearsOfExperience: {
          type: Number,
          min: 0,
          validate: Number.isInteger,
        },
        level: {
          type: String,
          enum: ["junior", "middle", "senior"],
        },
      },
    ],
    isEligibleToWork: { type: Boolean, default: false },
    ableToRelocate: { type: Boolean, default: false },
    mainRole: { type: String, minLength: 6, maxLength: 60 },
    experienceLevel: {
      type: String,
      enum: ["junior", "middle", "senior"],
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      validate: Number.isInteger,
    },
    preferredRoles: [{ type: String, minLength: 2, maxLength: 60 }],
    isOpenToWork: { type: Boolean, default: false },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
    },
    salaryExpectation: {
      min: {
        type: Number,
        min: 0,
        validate: Number.isInteger,
      },
      perHour: { type: Boolean, default: false },
      perYear: { type: Boolean, default: false },
    },
    profileCompletion: {
      type: Number,
      min: 0,
      max: 100,
      validate: Number.isInteger,
    },
    visibilityCount: {
      type: Number,
      min: 0,
      validate: Number.isInteger,
    },
    verifiedBadge: { type: Boolean, default: false },
    workHistory: [
      {
        company: { type: String, minLength: 6, maxLength: 60 },
        role: { type: String, minLength: 6, maxLength: 60 },
        roleDescription: { type: String, minLength: 6, maxLength: 600 },
        startDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/, // format MM-YYYY
        },
        endDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/, // format MM-YYYY
        },
        current: { type: Boolean, default: false },
        achievements: [{ type: String, minLength: 6, maxLength: 60 }],
      },
    ],
    education: [
      {
        institution: { type: String, minLength: 6, maxLength: 60 },
        educationLevel: {
          type: String,
          enum: [
            "High School Diploma",
            "GED",
            "Vocational Training",
            "Associate Degree",
            "Bachelors Degree",
            "Postgraduate Certificate",
            "Masters Degree",
            "Professional Degree",
            "Doctoral Degree",
            "Continuing Education",
          ],
        },
        degreeObtained: { type: String, minLength: 6, maxLength: 60 },
        country: { type: String, minLength: 2, maxLength: 60 },
        graduationYear: {
          type: Number,
          min: 0,
          validate: Number.isInteger,
        },
        educationStatus: {
          type: String,
          enum: ["Completed", "In Progress", "Incomplete"],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "candidates" }
);

CandidateSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.createdAt = this.createdAt;
  }
  next();
});

const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate;
