const express = require('express');
const { isAuth } = require('../utils/auth');
const { followSchool, followTeacher, followUser } = require('../controllers/follow');

const router = express.Router();

router.post('/school/:schoolId', isAuth, followSchool)
router.post('/teacher/:teacherId', isAuth, followTeacher)

router.post('/user/:userId', isAuth, followUser)

module.exports = router;
