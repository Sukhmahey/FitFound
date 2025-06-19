const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileViewsSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "candidates",
      required: true,
    },
    employerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "profile_views" }
);

const ProfileViews = mongoose.model("ProfileViews", ProfileViewsSchema);
module.exports = ProfileViews;
