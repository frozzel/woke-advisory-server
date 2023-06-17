const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/review");
const Movie = require("../models/movie");
const TV = require("../models/tv");
const ReviewTv = require("../models/reviewtv");

exports.sendError = (res, error, statusCode = 401) =>
  res.status(statusCode).json({ error });

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found", 404);
};

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );

  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar?.url,
  };
};

exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;
  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);
  
  next();
};

exports.averageRatingPipeline = (movieId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: { parentMovie: movieId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
        CRT: {
          $sum: {
            $cond: [{ $eq: ["$CRT", true] }, 1, 0],
          },
        },
        LGBTQ_content: {
          $sum: {
            $cond: [{ $eq: ["$LGBTQ_content", true] }, 1, 0],
          },
        },
        trans_content: {  
          $sum: {
            $cond: [{ $eq: ["$trans_content", true] }, 1, 0],
          },
        },
        anti_religion: {
          $sum: {
            $cond: [{ $eq: ["$anti_religion", true] }, 1, 0],
          },
        },
        globalWarming: {
          $sum: {
            $cond: [{ $eq: ["$globalWarming", true] }, 1, 0],
          },
        },
        leftWing: {
          $sum: {
            $cond: [{ $eq: ["$leftWing", true] }, 1, 0],
          },
        },
      },
    },
  ];
};
exports.averageRatingPipelineTv = (movieId) => {
  return [
    {
      $lookup: {
        from: "ReviewTv",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: { parentTv: movieId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
        CRT: {
          $sum: {
            $cond: [{ $eq: ["$CRT", true] }, 1, 0],
          },
        },
        LGBTQ_content: {
          $sum: {
            $cond: [{ $eq: ["$LGBTQ_content", true] }, 1, 0],
          },
        },
        trans_content: {  
          $sum: {
            $cond: [{ $eq: ["$trans_content", true] }, 1, 0],
          },
        },
        anti_religion: {
          $sum: {
            $cond: [{ $eq: ["$anti_religion", true] }, 1, 0],
          },
        },
        globalWarming: {
          $sum: {
            $cond: [{ $eq: ["$globalWarming", true] }, 1, 0],
          },
        },
        leftWing: {
          $sum: {
            $cond: [{ $eq: ["$leftWing", true] }, 1, 0],
          },
        },
      },
    },
  ];
};

exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.topRatedMoviesPipeline = (type) => {
  const matchOptions = {
    reviews: { $exists: true },
    // status: { $eq: "public" },
  };

  if (type) matchOptions.type = { $eq: type };

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};
exports.topRatedTvPipeline = (type) => {
  const matchOptions = {
    reviews: { $exists: true },
    // status: { $eq: "public" },
  };

  if (type) matchOptions.type = { $eq: type };

  return [
    {
      $lookup: {
        from: "TV",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.getAverageRatings = async (movieId) => {
  const movieReview = await Movie.findOne({ TMDB_Id: movieId });
  if (movieReview){

  
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPipeline(movieReview._id)
  );
  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
    reviews.CRT = CRT;
    reviews.LGBTQ_content = LGBTQ_content;
    reviews.trans_content = trans_content;
    reviews.anti_religion = anti_religion;
    reviews.globalWarming = globalWarming;
    reviews.leftWing = leftWing;

  }

  return reviews;
  } else if (!movieReview) {
    const [aggregatedResponse] = await Review.aggregate(
      this.averageRatingPipeline(movieId)
    );
    const reviews = {};
    // if(!aggregatedResponse)return null;
    if (aggregatedResponse) {
      const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing } = aggregatedResponse;
      reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
      reviews.reviewCount = reviewCount;
      reviews.CRT = CRT;
      reviews.LGBTQ_content = LGBTQ_content;
      reviews.trans_content = trans_content
      reviews.anti_religion = anti_religion;
      reviews.globalWarming = globalWarming;
      reviews.leftWing = leftWing;
      
    }
    return reviews;
  }
};
exports.getAverageRatingsTv = async (movieId) => {
  const movieReview = await TV.findOne({ TMDB_Id: movieId });
  if (movieReview){

  
  const [aggregatedResponse] = await ReviewTv.aggregate(
    this.averageRatingPipelineTv(movieReview._id)
  );
  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
    reviews.CRT = CRT;
    reviews.LGBTQ_content = LGBTQ_content;
    reviews.trans_content = trans_content;
    reviews.anti_religion = anti_religion;
    reviews.globalWarming = globalWarming;
    reviews.leftWing = leftWing;

  }

  return reviews;
  } else if (!movieReview) {
    const [aggregatedResponse] = await ReviewTv.aggregate(
      this.averageRatingPipelineTv(movieId)
    );
    const reviews = {};
    // if(!aggregatedResponse)return null;
    if (aggregatedResponse) {
      const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing } = aggregatedResponse;
      reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
      reviews.reviewCount = reviewCount;
      reviews.CRT = CRT;
      reviews.LGBTQ_content = LGBTQ_content;
      reviews.trans_content = trans_content
      reviews.anti_religion = anti_religion;
      reviews.globalWarming = globalWarming;
      reviews.leftWing = leftWing;
      
    }
    return reviews;
  }
};