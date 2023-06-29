const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
    source: {
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    urlToImage: {
        type: String,
        required: false,
    },
    publishedAt: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);