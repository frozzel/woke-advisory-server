const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    grade: {
      type: String,
      trim: true,
      required: true,
    },
    classType: {
        type: String,
        trim: true,
        required: true,
      },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    parentSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    reviewsTeacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReviewsTeacher" }],
    alertsTeacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "AlertsTeacher" }],
  },
  { timestamps: true }
);

teacherSchema.index({ name: "text" });

module.exports = mongoose.model("Teacher", teacherSchema);