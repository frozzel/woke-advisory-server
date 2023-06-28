const express = require("express");
const { getSingleSchool, searchSchools } = require("../controllers/school");

const router = express.Router();

router.get("/single/:schoolId", getSingleSchool);
router.get("/search", searchSchools);

module.exports = router;