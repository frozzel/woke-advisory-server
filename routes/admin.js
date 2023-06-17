const { getAppInfo, getMostRated, getMostRatedTv  } = require("../controllers/admin");
const { isAuth, isAdmin } = require("../utils/auth");

const router = require("express").Router();

router.get("/app-info", isAuth, isAdmin, getAppInfo);
router.get("/most-rated", isAuth, isAdmin, getMostRated);
router.get("/most-rated-tv", isAuth, isAdmin, getMostRatedTv);

module.exports = router;