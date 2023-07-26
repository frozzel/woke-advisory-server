const router = require("express").Router();
const { isAuth, validate } = require("../utils/auth");
const { addAlertsTeacher, getAlertsTeacher, addComment, likeAlert, editAlert, deleteAlert } = require("../controllers/alertsteacher");
const { uploadImage } = require("../utils/multer");
const e = require("express");



router.get("/:teacherId",  getAlertsTeacher);
router.post("/add/:teacherId", isAuth, uploadImage.single("image"), validate, addAlertsTeacher);
router.post("/addcomment/:alertId", isAuth, validate, addComment);
router.post("/addlike/:alertId", isAuth, validate, likeAlert);
router.post("/edit/:alertId", isAuth, uploadImage.single("image"), validate, editAlert);
router.delete("/delete/:alertId", isAuth, validate, deleteAlert);

module.exports = router;