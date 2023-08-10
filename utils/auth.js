const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendError } = require("./helper");


exports.userValidator = [
    check("name").trim().not().isEmpty().withMessage("Name is missing!"),
    check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check('username').trim().not().isEmpty().withMessage('Username is missing!'),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters long!"),
];

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({ error: error[0].msg });
    }
   
    next();
};
exports.validatePassword = [
    check("newPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters long!"),
];

exports.signInValidator = [

    check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
       
];

exports.isAuth = async(req, res, next) => {
    const token =  req.headers?.authorization
    
    if (!token) return sendError(res, 'Invalid token!', 401)
  
    const jwtToken = token.split('Bearer ')[1]
  
    if (!jwtToken) return sendError(res, 'Invalid token!', 401)
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET)
    const {userId} = decode
  
    const user = await User.findById(userId)
    if(!user) return sendError(res, 'No user found', 404);

    req.user = user;
    next();
    
    }
exports.actorInfoValidator = [
    check("name").trim().not().isEmpty().withMessage("Actor name is missing!"),
    check("about")
        .trim()
        .not()
        .isEmpty()
        .withMessage("About is a required field!"),
    check("gender")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Gender is a required field!"),
    ];

exports.teacherInfoValidator = [
    // check("name").trim().not().isEmpty().withMessage("teacher name is missing!"),
    check("about")
        .trim()
        .not()
        .isEmpty()
        .withMessage("About is a required field!"),
    check("grade")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Grade is a required field!"),
    check("classType")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Class Type is a required field!"),
    ];

exports.isAdmin = async (req, res, next) => {
    const { user } = req;

    if (user.role !== "admin") return sendError(res, "Unauthorized!", 401);


    next();
    }


