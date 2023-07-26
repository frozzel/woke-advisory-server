const mongoose = require("mongoose");

const alertsTeacherSchema = mongoose.Schema({
    content: {
        type: String,
        // trim: true,
        required: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        },

    image: {
        type: Object,
        url: { type: String, required: false },
        public_id: { type: String, required: true },
        },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            },
        content: {
            type: String,
            required: true,
            },
        }],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            },
        
        }],

    }, { timestamps: true });

module.exports = mongoose.model("AlertsTeacher", alertsTeacherSchema);
