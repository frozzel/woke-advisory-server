const express = require("express");
const { getNews, getNewsMongo } = require("../controllers/news");

const router = express.Router();

router.get("/all", getNews);
router.get("/relevant", getNewsMongo);


module.exports = router;