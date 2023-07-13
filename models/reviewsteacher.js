const mongoose = require("mongoose");

const reviewsTeacherSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      parentTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
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
      trans_sports: {
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

module.exports = mongoose.model("ReviewsTeacher", reviewsTeacherSchema);