const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}/;

const UserSchema = new Schema(
  {
    idFirebaseUser: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: [true, "User email is required"],
      match: [emailRegex, "Please provide a valid email address"],
      unique: true,
    },
    name: { type: String, minLength: 2, maxLength: 60 },
    phone: {
      type: String,
      match: [phoneRegex, "Please provide a valid phone number"],
    },
    role: {
      type: String,
      enum: ["candidate", "employer"],
      required: true,
    },
    personalSummary: { type: String, minLength: 50, maxLength: 600 },
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
