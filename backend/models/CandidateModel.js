const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    personalInfo: {
      firstName: { type: String, trim: true, minLength: 2, maxLength: 60 },
      middleName: { type: String, trim: true, maxLength: 60 },
      lastName: { type: String, trim: true, minLength: 2, maxLength: 60 },
      email: { type: String, trim: true, match: /^\S+@\S+\.\S+$/ },
      currentStatus: { type: String, trim: true, maxLength: 100 },
      specialization: { type: String, trim: true, maxLength: 100 },
    },

    basicInfo: {
      phoneNumber: { type: String, trim: true, maxLength: 20 },
      workStatus: { type: String, trim: true, maxLength: 100 },
      language: { type: String, trim: true, maxLength: 50 },
      bio: { type: String, trim: true, maxLength: 1000 },
      additionalInfo: { type: String, trim: true, maxLength: 1000 },
    },

    skills: [
      {
        skill: { type: String, minLength: 2, maxLength: 60, trim: true },
      },
    ],

    workHistory: [
      {
        companyName: { type: String, minLength: 2, maxLength: 60, trim: true },
        jobTitle: { type: String, minLength: 2, maxLength: 60, trim: true },
        achievements: [
          { type: String, minLength: 2, maxLength: 100, trim: true },
        ],
        startDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/,
          trim: true,
        },
        endDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/,
          trim: true,
        },
        role: { type: String, minLength: 2, maxLength: 60, trim: true },
        experienceLevel: {
          type: String,
          enum: ["junior", "middle", "senior","lead", "supervisor", "director"],
          trim: true,
        },
        remarkFromEmployer: { type: String, maxLength: 500, trim: true },
      },
    ],

    portfolio: {
      socialLinks: {
        linkedin: {
          type: String,
          trim: true,
          match: [
            /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
            "Invalid LinkedIn URL",
          ],
        },
        personalPortfolioWebsite: { type: String, trim: true },
        additionalLinks: [{ type: String, trim: true }],
      },
    },

    education: [
      {
        instituteName: {
          type: String,
          minLength: 2,
          maxLength: 60,
          trim: true,
        },
        credentials: { type: String, trim: true, maxLength: 100 },
        fieldOfStudy: { type: String, trim: true, maxLength: 100 },
        startDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/,
          trim: true,
        },
        endDate: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(\d{4})$/,
          trim: true,
        },
      },
    ],

    certificates: [{ type: String, trim: true, maxLength: 200 }],

    jobPreference: {
      desiredJobTitle: [
        { type: String, minLength: 2, maxLength: 60, trim: true },
      ],
      jobType: {
        type: String,
        enum: [
          "Remote",
          "full-time",
          "part-time",
          "contract",
          "internship",
          "on-site",
          "hybrid",
        ],
        trim: true,
      },
      salaryExpectation: {
        min: { type: Number, min: 0, validate: Number.isInteger },
        perHour: { type: Boolean, default: false },
        perYear: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true, collection: "candidates" }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate;
