const router = require("express").Router();
const { isAuth, validate } = require("../utils/auth");
const { addAlertsSchool, getAlertsSchool, addComment, likeAlert, editAlert, deleteAlert } = require("../controllers/alertsschool");
const { uploadImage } = require("../utils/multer");
const e = require("express");



router.get("/:schoolId",  getAlertsSchool);
router.post("/add/:schoolId", isAuth, uploadImage.single("image"), validate, addAlertsSchool);
router.post("/addcomment/:alertId", isAuth, validate, addComment);
router.post("/addlike/:alertId", isAuth, validate, likeAlert);
router.post("/edit/:alertId", isAuth, uploadImage.single("image"), validate, editAlert);
router.delete("/delete/:alertId", isAuth, validate, deleteAlert);

module.exports = router;