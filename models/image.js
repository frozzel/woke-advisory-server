const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
    {
    author: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    profileUrl: {
        type: String,
        required: false,
    },
    unsplashId: {
        type: String,
        required: false,
    },

},

{ timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
