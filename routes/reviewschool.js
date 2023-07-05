const router = require("express").Router();
const { addReview, updateReview, removeReview, getReviewsBySchool, getReviewsByUser } = require("../controllers/reviewschool");
const { isAuth, validate } = require("../utils/auth");
const { validateRatings } = require("../utils/validator");

router.post("/add/:schoolId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-school/:schoolId", getReviewsBySchool);
router.get("/get-reviews-by-user/:userId", getReviewsByUser);

module.exports = router;