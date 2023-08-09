const router = require("express").Router();
const { isAuth, validate } = require("../utils/auth");
const { addPostUser, getPostUser, addComment, likeAlert, editAlert, deleteAlert, searchUser } = require("../controllers/post");
const { uploadImage } = require("../utils/multer");




router.get("/:userId",  getPostUser);
router.post("/add/:userId", isAuth, uploadImage.single("image"), validate, addPostUser);
router.post("/addcomment/:postId", isAuth, validate, addComment);
router.post("/addlike/:postId", isAuth, validate, likeAlert);
router.post("/edit/:postId", isAuth, uploadImage.single("image"), validate, editAlert);
router.delete("/delete/:postId", isAuth, validate, deleteAlert);
router.get("/search/:userId/",  searchUser);

module.exports = router;