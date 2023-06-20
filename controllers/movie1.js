const fetch = require('node-fetch');
const { sendError, getAverageRatings, getAverageRatingsTv} = require('../utils/helper');
const Review = require("../models/review");
const { averageRatingPipeline, averageRatingPipelineTv } = require("../utils/helper");
const Movie = require("../models/movie");
const TV = require("../models/tv");
const ReviewTv = require("../models/reviewtv");



exports.getUpcomingMovies = async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.TMDB_READ_TOKEN
        }
      };
    try{
      const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&region=us', options);
    
      const movie = await response.json();
      const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m.id);
        const url = "https://image.tmdb.org/t/p/original"+m.backdrop_path;
        return {
          id: m.id,
          title: m.title,
          backdrop_path: url,
          reviews: { ...reviews },
        };
      };
      const movies = await Promise.all(movie.results.slice(0, 6).map(mapMovies));
      res.json({ movies });
     
    } catch (error) {
      console.log(error);
    }
    
}
exports.getNowPlaying = async (req, res) => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=us';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.TMDB_READ_TOKEN
      }
    };
    try{
      const response = await fetch(url, options);
   
      const movie = await response.json();
      const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m.id);
        return {
          id: m.id,
          title: m.title,
          backdrop_path: m.backdrop_path,
          reviews: { ...reviews },
        };
      };
      const nowPlayingMovies = await Promise.all(movie.results.slice(0, 10).map(mapMovies));
      res.json({ movies: nowPlayingMovies });
    } catch (error) {
      console.log(error);
    }
}
exports.getPopularMovies = async (req, res) => {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.TMDB_READ_TOKEN
      }
    };

    try{
      const response = await fetch(url, options);
   
      const movie = await response.json();
      const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m.id);
        return {
          id: m.id,
          title: m.title,
          backdrop_path: m.backdrop_path,
          reviews: { ...reviews },
        };
      };
      const popularMovies = await Promise.all(movie.results.slice(0, 10).map(mapMovies));
      res.json({ movies: popularMovies });
      // res.json(movie);
    } catch (error) {
      console.log(error);
    }
}

exports.getSingleMovie = async (req, res) => {
  const {movieId} = req.params;
  
  const url = 'https://api.themoviedb.org/3/movie/' +movieId+ '?language=en-US&append_to_response=videos,external_ids';
  

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.TMDB_READ_TOKEN
    }
  };
  try{
    const response = await fetch(url, options)
 
    const movie = await response.json();
    
    const movieReview = await Movie.findOne({ TMDB_Id: movieId });
    
    if(movieReview && movieReview.reviews.length > 0) {
      const [aggregatedResponse] = await Review.aggregate(
        averageRatingPipeline(movieReview._id)
      );
      
      const reviews = {};
      if(!aggregatedResponse)return null;
      if (aggregatedResponse) {
        const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing} = aggregatedResponse;
        reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviews.reviewCount = reviewCount;
        reviews.CRT = CRT;
        reviews.LGBTQ_content = LGBTQ_content;
        reviews.trans_content = trans_content;
        reviews.anti_religion = anti_religion;
        reviews.globalWarming = globalWarming;
        reviews.leftWing = leftWing;
        
      } 
      
    
    const {
      id,
      title,
      overview,
      release_date,
      genres,
      original_language,
      backdrop_path,
      videos,
      external_ids,
      CRT,
      LGBTQ_content,
      trans_content,
      anti_religion,
      globalWarming,
      leftWing
      
    } = movie;
    
    if (videos.results.length === 0) {
      trailer = null
      trailer2 = null
      trailer3 = null
    } else if (videos.results.length === 1) {
      trailer= "https://www.youtube.com/embed/" + videos.results[0].key
      trailer2 = null
      trailer3 = null
    } else  {
      trailer = "https://www.youtube.com/embed/" + videos.results[0].key
      trailer2 = "https://www.youtube.com/embed/" + videos.results[1].key
      if (!videos.results[2]) {
        
        trailer3 = null
      } else {
        
        trailer3 = "https://www.youtube.com/embed/" + videos.results[2].key
      }
    }
    res.json({
      movie: {
        id,
        title,
        overview,
        release_date,
        genres: genres.map((g) => g.name),
        original_language,
        backdrop_path,
        trailer: trailer,
        trailer2: trailer2,
        trailer3: trailer3,
        IMDB: external_ids.imdb_id, 
        reviews: { ...reviews },
        CRT,
        LGBTQ_content,
        trans_content,
        anti_religion,
        globalWarming,
        leftWing
        
      },
    })} else if (!movieReview || movieReview.reviews.length === 0) {
      // const [aggregatedResponse] = await Review.aggregate(
      //   averageRatingPipeline(movieId)
      // );
  
      const reviews = {};
      // if(!aggregatedResponse)return null;
      // if (aggregatedResponse) {
      //   const { ratingAvg, reviewCount } = aggregatedResponse;
      //   reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
      //   reviews.reviewCount = reviewCount;
      //   reviews.CRT = CRT;
      //   reviews.LGBTQ_content = LGBTQ_content;
      //   reviews.trans_content = trans_content;
      //   reviews.anti_religion = anti_religion;
      //   reviews.globalWarming = globalWarming;
      //   reviews.leftWing = leftWing;
      // }
      
      const {
        id,
        title,
        overview,
        release_date,
        genres,
        original_language,
        backdrop_path,
        videos,
        external_ids,
        CRT,
        LGBTQ_content,
        trans_content,
        anti_religion,
        globalWarming,
        leftWing
        
        
      } = movie;
     
      if (videos.results.length === 0) {
        trailer = null
        trailer2 = null
        trailer3 = null
      } else if (videos.results.length === 1) {
        trailer= "https://www.youtube.com/embed/" + videos.results[0].key
        trailer2 = null
        trailer3 = null
      } else  {
        trailer = "https://www.youtube.com/embed/" + videos.results[0].key
        trailer2 = "https://www.youtube.com/embed/" + videos.results[1].key
        if (!videos.results[2]) {
          
          trailer3 = null
        } else {
          
          trailer3 = "https://www.youtube.com/embed/" + videos.results[2].key
        }
      }
      res.json({
        movie: {
          id,
          title,
          overview,
          release_date,
          genres: genres.map((g) => g.name),
          original_language,
          backdrop_path,
          trailer: trailer,
          trailer2: trailer2,
          trailer3: trailer3? trailer3 : null,
          IMDB: external_ids.imdb_id,
          reviews: { ...reviews },
          CRT,
          LGBTQ_content,
          trans_content,
          anti_religion,
          globalWarming,
          leftWing
        },
      });
    }
    // console.log(movie.videos.results.length)
    // res.json({movie})
    } catch (error) {
      console.log(error);
      return sendError(res, "Movie/TV id is not valid!"); 
    }
}

exports.getRelatedMovies = async (req, res) => {
  const {movieId} = req.params;
  const url = 'https://api.themoviedb.org/3/movie/' +movieId+ '/recommendations?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.TMDB_READ_TOKEN
    }
  };
  try{
    const response = await fetch(url, options)
    const movie = await response.json();
    
    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m.id);
      return {
        id: m.id,
        title: m.title,
        backdrop_path: m.backdrop_path,
        reviews: { ...reviews },
      };
    };
    const relatedMovies = await Promise.all(movie.results.slice(1, 6).map(mapMovies));
  
    res.json({ movies: relatedMovies });
    } catch (error) {
      console.log(error);
      return sendError(res, "Movie id is not valid!"); 
    }
}
exports.searchMovies = async (req, res) => {
  const { title } = req.query;
  const url = 'https://api.themoviedb.org/3/search/movie?query='+title+'&include_adult=false&language=en-US&page=1'
  // if (!title.trim()) return sendError(res, "Invalid request!");
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.TMDB_READ_TOKEN
    }
  };
  try{
    const response = await fetch(url, options);
    const movies = await response.json();

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m.id);
      return {
        id: m.id,
        title: m.title,
        backdrop_path: m.backdrop_path,
        reviews: { ...reviews },
      };
    };
    const relatedMovies = await Promise.all(movies.results.slice(0, 10).map(mapMovies));
  
    res.json({ movies: relatedMovies });
  } catch (error) {
    console.log(error);
    return sendError(res, "Movie id is not valid!"); 
  }
}
exports.getPopularTv = async (req, res) => {
  const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.TMDB_READ_TOKEN
      }
    };
  try{
    const response = await fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&region=us', options)
    const movie = await response.json();
    const mapMovies = async (m) => {
      const reviews = await getAverageRatingsTv(m.id);
      return {
        id: m.id,
        title: m.name,
        backdrop_path: m.backdrop_path,
        reviews: { ...reviews },
      };
    };
    const nowPlayingMovies = await Promise.all(movie.results.slice(0, 10).map(mapMovies));
    res.json({ movies: nowPlayingMovies });
  } catch (error) {
    console.log(error);
  }
  
}
exports.getSingleTv = async (req, res) => {
  const {movieId} = req.params;
  
  const url = 'https://api.themoviedb.org/3/tv/' +movieId+ '?language=en-US&append_to_response=videos,external_ids';
  

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.TMDB_READ_TOKEN
    }
  };
  try{
    const response = await fetch(url, options)
 
    const movie = await response.json();
    
    
    const movieReview = await TV.findOne({ TMDB_Id: movieId });
    if(movieReview && movieReview.reviews.length > 0) {
      const [aggregatedResponse] = await ReviewTv.aggregate(
        averageRatingPipelineTv(movieReview._id)
      );
  
      const reviews = {};
      // if(!aggregatedResponse)return null;
      if (aggregatedResponse) {
        const { ratingAvg, reviewCount, CRT, LGBTQ_content, trans_content, anti_religion, globalWarming, leftWing} = aggregatedResponse;
          reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
          reviews.reviewCount = reviewCount;
          reviews.CRT = CRT;
          reviews.LGBTQ_content = LGBTQ_content;
          reviews.trans_content = trans_content;
          reviews.anti_religion = anti_religion;
          reviews.globalWarming = globalWarming;
          reviews.leftWing = leftWing;
          
        } 
      
    
    const {
      id,
      name,
      overview,
      first_air_date,
      genres,
      original_language,
      backdrop_path,
      videos,
      external_ids,
      CRT,
      LGBTQ_content,
      trans_content,
      anti_religion,
      globalWarming,
      leftWing
      
      
    } = movie;

    if (videos.results.length === 0) {
      trailer = null
      trailer2 = null
      trailer3 = null
    } else if (videos.results.length === 1) {
      trailer= "https://www.youtube.com/embed/" + videos.results[0].key
      trailer2 = null
      trailer3 = null
    } else  {
      trailer = "https://www.youtube.com/embed/" + videos.results[0].key
      trailer2 = "https://www.youtube.com/embed/" + videos.results[1].key
      if (!videos.results[2]) {
        
        trailer3 = null
      } else {
        
        trailer3 = "https://www.youtube.com/embed/" + videos.results[2].key
      }
    }

    res.json({
      movie: {
        id,
        title: name,
        overview,
        releaseDate: first_air_date,
        genres: genres.map((g) => g.name),
        original_language,
        backdrop_path,
        trailer: trailer,
        trailer2: trailer2,
        trailer3: trailer3,
        reviews: { ...reviews },
        IMDB: external_ids.imdb_id,
        CRT,
        LGBTQ_content,
        trans_content,
        anti_religion,
        globalWarming,
        leftWing

      },
    })} else if (!movieReview || movieReview.reviews.length === 0) {
      // const [aggregatedResponse] = await tvReview.aggregate(
      //   averageRatingPipeline(movieId)
      // );
  
      const reviews = {};
      // if(!aggregatedResponse)return null;
      // if (aggregatedResponse) {
      //   const { ratingAvg, reviewCount } = aggregatedResponse;
      //   reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
      //   reviews.reviewCount = reviewCount;
      // }
      
      const {
        id,
        name,
        overview,
        first_air_date,
        genres,
        original_language,
        backdrop_path,
        videos,
        external_ids,
        CRT,
        LGBTQ_content,
        trans_content,
        anti_religion,
        globalWarming,
        leftWing
        
        
      } = movie;

      if (videos.results.length === 0) {
        trailer = null
        trailer2 = null
        trailer3 = null
      } else if (videos.results.length === 1) {
        trailer= "https://www.youtube.com/embed/" + videos.results[0].key
        trailer2 = null
        trailer3 = null
      } else  {
        trailer = "https://www.youtube.com/embed/" + videos.results[0].key
        trailer2 = "https://www.youtube.com/embed/" + videos.results[1].key
        if (!videos.results[2]) {
          
          trailer3 = null
        } else {
          
          trailer3 = "https://www.youtube.com/embed/" + videos.results[2].key
        }
      }
  
      res.json({
        movie: {
          id,
          title: name,
          overview,
          releaseDate: first_air_date,
          genres: genres.map((g) => g.name),
          original_language,
          backdrop_path,
          trailer: trailer,
          trailer2: trailer2,
          trailer3: trailer3,
          IMDB: external_ids.imdb_id,
          reviews: { ...reviews },
          CRT,
          LGBTQ_content,
          trans_content,
          anti_religion,
          globalWarming,
          leftWing
        },
      });
    }
    // res.json({movie})
    } catch (error) {
      console.log(error);
      return sendError(res, "Movie/TV id is not valid!"); 
    }
}
exports.searchTv = async (req, res) => {
  const { title } = req.query;
  const url = 'https://api.themoviedb.org/3/search/tv?query='+title+'&include_adult=false&language=en-US&page=1'
  // if (!title.trim()) return sendError(res, "Invalid request!");
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.TMDB_READ_TOKEN
    }
  };
  try{
    const response = await fetch(url, options);
    const tv = await response.json();

    const mapMovies = async (m) => {
      const reviews = await getAverageRatingsTv(m.id);
      return {
        id: m.id,
        title: m.name,
        backdrop_path: m.backdrop_path,
        reviews: { ...reviews },
      };
    };
    const relatedMovies = await Promise.all(tv.results.slice(0, 10).map(mapMovies));
  
    res.json({ tv: relatedMovies });
  } catch (err) {
    console.log(err);
    return sendError(res, "Tv id is not valid!"); 
  }
}
exports.getRelatedTv = async (req, res) => {
    const {movieId} = req.params;
    const url = 'https://api.themoviedb.org/3/tv/' +movieId+ '/similar?language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.TMDB_READ_TOKEN
      }
    };
    try{
      const response = await fetch(url, options)
      const tv = await response.json();
      
      const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m.id);
        return {
          id: m.id,
          title: m.name,
          backdrop_path: m.backdrop_path,
          reviews: { ...reviews },
        };
      };
      const relatedTv = await Promise.all(tv.results.slice(0, 5).map(mapMovies));
    
      res.json({ tv: relatedTv });
      } catch (error) {
        console.log(error);
        return sendError(res, "TV Series id is not valid!"); 
      }
  }