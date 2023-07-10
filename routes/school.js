const express = require("express");
const { getSingleSchool, searchSchools, getTeacherBySchool } = require("../controllers/school");

const router = express.Router();

router.get("/single/:schoolId", getSingleSchool);
router.get("/search", searchSchools);
router.get("/teachers/:schoolId", getTeacherBySchool);

module.exports = router;