const express = require("express");
const { getUpcomingMovies, getNowPlaying, getPopularMovies, getSingleMovie, getRelatedMovies, searchMovies, getPopularTv, getSingleTv, searchTv, getRelatedTv } = require("../controllers/movie1");



const router = express.Router();

router.get("/upcoming", getUpcomingMovies);
router.get("/nowPlaying", getNowPlaying);
router.get("/popular", getPopularMovies);
router.get("/popularTv", getPopularTv);
router.get("/single/:movieId", getSingleMovie);
router.get("/singleTv/:movieId", getSingleTv);
router.get("/related/:movieId", getRelatedMovies);
router.get("/search-public", searchMovies, searchTv);
router.get("/searchTv", searchTv);
router.get("/relatedTv/:movieId", getRelatedTv);

module.exports = router;