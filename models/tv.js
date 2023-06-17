const mongoose = require('mongoose');// import mongoose
const genres = require("../utils/genres");


const tvSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: false
    },
    overview: {
        type: String,
        trim: true,
        required: false
    },
    release_date: {
        type: Date,
        required: false
    },
    TMDB_Id: {
        type: String,
        required: false,
        // enum: ['public', 'private']
    },
    IMDB: {
        type: String,
        required: false,
        
    },
    genres: {
        type: [String],
        required: false,
        // enum: genres
    },
    backdrop_path: {
        type: String,
        required: false,
        
    },
        
    trailer: {
        type: String,
        required: false,
        
    },    
    trailer2: {
        type: String,
        required: false,
        
    },    
    trailer3: {
        type: String,
        required: false,
        
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReviewTv" }],
    original_language: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
    );

module.exports = mongoose.model('TV', tvSchema);