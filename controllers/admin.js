const Movie = require("../models/movie");
const User = require("../models/user");
const TV = require("../models/tv");

const {
  topRatedMoviesPipeline,
  getAverageRatings, getAverageRatingsTv,
  topRatedTvPipeline
} = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  const movieCount = await Movie.countDocuments();
  const tvCount = await TV.countDocuments();
  const userCount = await User.countDocuments();

  res.json({ appInfo: { movieCount, tvCount, userCount } });
};

exports.getMostRated = async (req, res) => {
  const movies = await Movie.aggregate(topRatedMoviesPipeline());

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};
exports.getMostRatedTv = async (req, res) => {
  const movies = await TV.aggregate(topRatedTvPipeline());

  const mapMovies = async (m) => {
    const reviews = await getAverageRatingsTv(m._id);

    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};