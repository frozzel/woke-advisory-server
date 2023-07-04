const mongoose = require("mongoose");

const reviewSchoolSchema = mongoose.Schema({
  // owner parentMovie rating content
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentMovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
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
  LGBTQ_content: {
    type: Boolean,
    default: false,
  },
  trans_content: {
    type: Boolean,
    default: false,
  },
  anti_religion: {
    type: Boolean,
    default: false,
  },
  globalWarming: {
    type: Boolean,
    default: false,
  },
  leftWing: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ReviewSchools", reviewSchoolSchema);