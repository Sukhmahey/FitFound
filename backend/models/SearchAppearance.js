const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SearchAppearanceSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    searchQuery: {
      type: [String],
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    collection: "search_appearances",
  }
);

SearchAppearanceSchema.index({ candidateId: 1, searchQuery: 1 });

const SearchAppearance = mongoose.model(
  "SearchAppearance",
  SearchAppearanceSchema
);

module.exports = SearchAppearance;
