const mongoose = require("mongoose");

const reviewSchoolSchema = mongoose.Schema({
  // owner parentMovie rating content
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentSchool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  content: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  CRT: {  
    type: Boolean,
    default: false,
  },
  trans_grooming: {
    type: Boolean,
    default: false,
  },
  trans_pronouns: {
    type: Boolean,
    default: false,
  },
  trans_bathroom: {
    type: Boolean,
    default: false,
  },
  globalWarming: {
    type: Boolean,
    default: false,
  },
  anti_parents_rights: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ReviewSchool", reviewSchoolSchema);