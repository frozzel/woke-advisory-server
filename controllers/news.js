const { createApi }=  require('unsplash-js') ;
const fetch = require('node-fetch');
const News = require('../models/news');
const Image = require('../models/image');




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

  res.json({ news});
};

exports.getImages = async (req, res) => {
  const unsplash = createApi({
    accessKey: process.env.UPSPLASH_KEY,
    fetch: fetch,
  });
  // const { searchTerm } = req.params;
  try {
    const response = await unsplash.collections.getPhotos({collectionId: ["-8PkV3atF68"], perPage: 30, page: 2});
    
    const mapImages = async (i) => {
  
      const newImage = new Image({
        unsplashId: i.id,
        imageUrl: i.urls.raw,
        author: i.user.name,
        profileUrl: i.user.links.html,
      });
      await newImage.save();
    };

    const images = await Promise.all(response.response.results.map(mapImages));
    res.json({ images });
  } catch (error) {
    console.log(error);
  }
}

exports.getImagesMongo = async (req, res) => {
  const images = await Image.find({})
  
  oneImage = images[Math.floor(Math.random() * images.length)];

  res.json({ oneImage });
}