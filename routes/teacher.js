const express = require("express");
const {
  createTeacher,
  updateTeacher,
  removeTeacher,
  searchTeacher,
  getLatestTeachers,
  getSingleTeacher,
  getTeachers,
} = require("../controllers/teacher");
const { uploadImage } = require("../utils/multer");
const { teacherInfoValidator, validate, isAuth, isAdmin } = require("../utils/auth");

const router = express.Router();

router.post(
  "/create/:schoolId",
  isAuth,
//   isAdmin,
  uploadImage.single("avatar"),
  teacherInfoValidator,
  validate,
  createTeacher
);

router.post(
  "/update/:teacherId",
  isAuth,
  // isAdmin,
  uploadImage.single("avatar"),
  teacherInfoValidator,
  validate,
  updateTeacher
);

router.delete("/:teacherId", isAuth, isAdmin, removeTeacher);
router.get("/search", isAuth, isAdmin, searchTeacher);
router.get("/latest-uploads", getLatestTeachers);
router.get("/teachers", isAuth, isAdmin, getTeachers);
router.get("/single/:id", getSingleTeacher);

module.exports = router;