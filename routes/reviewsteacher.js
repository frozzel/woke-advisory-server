const router = require("express").Router();
const { addReview, updateReview, removeReview, getReviewsByTeacher, getReviewsByUser } = require("../controllers/reviewsteacher");
const { isAuth, validate } = require("../utils/auth");
const { validateRatings } = require("../utils/validator");

router.post("/add/:teacherId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-teacher/:teacherId", getReviewsByTeacher);
router.get("/get-reviews-by-user/:userId", getReviewsByUser);

module.exports = router;