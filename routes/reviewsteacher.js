const router = require("express").Router();
const { addReview, updateReview, removeReview, getReviewsBySchool, getReviewsByUser } = require("../controllers/reviewsteacher");
const { isAuth, validate } = require("../utils/auth");
const { validateRatings } = require("../utils/validator");

router.post("/add/:teacherId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-school/:teacherId", getReviewsBySchool);
router.get("/get-reviews-by-user/:userId", getReviewsByUser);

module.exports = router;