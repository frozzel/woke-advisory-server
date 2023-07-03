const express = require("express");
const { getNews, getNewsMongo, getImages, getImagesMongo } = require("../controllers/news");

const router = express.Router();

router.get("/all", getNews);
router.get("/relevant", getNewsMongo);
router.get("/images/:searchTerm", getImages);
router.get("/images", getImagesMongo);


module.exports = router;