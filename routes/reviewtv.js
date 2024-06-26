const router = require("express").Router();
const { addReview, updateReview, removeReview, getReviewsByMovie, getReviewsByUser } = require("../controllers/reviewtv");
const { isAuth, validate } = require("../utils/auth");
const { validateRatings } = require("../utils/validator");

router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);
router.get("/get-reviews-by-user/:userId", getReviewsByUser);

module.exports = router;