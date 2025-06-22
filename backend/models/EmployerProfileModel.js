const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyLogo: { type: String },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    establishedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer year",
      },
    },
    businessRegisteredNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      maxLength: 50,
    },
    industrySector: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5000+",
      ],
    },
    workLocation: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 1000,
    },
    contactInfo: {
      profilePicture: { type: String, trim: true },
      firstName: { type: String, trim: true, maxLength: 60 },
      middleName: { type: String, trim: true, maxLength: 60 },
      lastName: { type: String, trim: true, maxLength: 60 },
      designation: { type: String, trim: true, maxLength: 60 },
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
      linkedInProfile: {
        type: String,
        trim: true,
        match: [
          /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
          "Invalid LinkedIn URL",
        ],
      },
      additionalDetails: { type: String, trim: true, maxLength: 1000 },
    },
  },
  {
    timestamps: true,
    collection: "employerProfiles",
  }
);

const EmployerProfile = mongoose.model(
  "EmployerProfile",
  EmployerProfileSchema
);
module.exports = EmployerProfile;
