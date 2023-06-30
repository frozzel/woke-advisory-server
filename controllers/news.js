const fetch = require('node-fetch');
const News = require('../models/news');

exports.getNews = async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEWS_API,
        }
      };
    try{
      const response = await fetch('https://newsapi.org/v2/everything?q=school+transgender&searchIn=title&from=2023-05-30&to=2023-06-29&sortBy=popularity', options);
    
      const news = await response.json();
      const mapNews = async (n) => {
         const newNews= new News({
          source: n.source.name,
          author: n.author,
          title: n.title,
            description: n.description,
            url: n.url,
            urlToImage: n.urlToImage,
            publishedAt: n.publishedAt,
            content: n.content,

        });
        await newNews.save();
        console.log("done");
      };
      const movies = await Promise.all(news.articles.map(mapNews));
      res.json({ news, movies });
     
    } catch (error) {
      console.log(error);
    }
    
}

exports.getNewsMongo = async (req, res) => {
  

  const news = await News.find({})
    .sort({ createdAt: -1 })

  // const results = movies.map((movie) => ({
  //   id: movie._id,
  //   title: movie.title,
  //   overview: movie.overview,
  //   release_date: movie.release_date,
  //   TMDB_Id: movie.TMDB_Id,
  //   IMDB: movie.IMDB,
  //   backdrop_path: movie.backdrop_path,
  //   trailer: movie.trailer,
  //   trailer2: movie.trailer2,
  //   trailer3: movie.trailer3,
  //   original_language: movie.original_language,
    
  //   genres: movie.genres,
    
  // }));

  res.json({ news});
};