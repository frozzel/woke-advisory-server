const {isValidObjectId} = require('mongoose');
const Teacher = require('../models/teacher');
const School = require('../models/school');
const User = require('../models/user');
const {sendError} = require('../utils/helper');


exports.followSchool = async (req, res) => {
    const {schoolId} = req.params;
    const userId = req.user._id;
    console.log( userId);
    
    if (!isValidObjectId(schoolId)) return sendError(res, "Invalid School!");
    
    const users = await User.findById(userId);
    if (!users) return sendError(res, "Invalid request, User not found!");
    
    // if (users.schoolsFollowing.includes(schoolId)) return sendError(res, "Already following this School!");
    const index = users.schoolsFollowing.indexOf(schoolId);
    if (index > -1) {
        users.schoolsFollowing.splice(index, 1);
    } else {
        users.schoolsFollowing.push(schoolId);
    }
    
    // users.schoolsFollowing.push(schoolId);
    await users.save();
    
    res.json({user: {id: users._id, name: users.name, email: users.email, isVerified: users.isVerified, role: users.role, avatar: users.avatar?.url, bio: users.bio, schoolsFollowing: users.schoolsFollowing}})
    }

exports.followTeacher = async (req, res) => {
    const {teacherId} = req.params;
    const userId = req.user._id;
    console.log( userId);

    if (!isValidObjectId(teacherId)) return sendError(res, "Invalid Teacher!");

    const users = await User.findById(userId);
    if (!users) return sendError(res, "Invalid request, User not found!");

    const index = users.teachersFollowing.indexOf(teacherId);
    if (index > -1) {
        users.teachersFollowing.splice(index, 1);
    }
    else {
        users.teachersFollowing.push(teacherId);
    }

    await users.save();

    res.json({user: {id: users._id, name: users.name, email: users.email, isVerified: users.isVerified, role: users.role, avatar: users.avatar?.url, bio: users.bio, teachersFollowing: users.teachersFollowing}})
}

exports.followUser = async (req, res) => {
    const {userId} = req.params;
    const user = req.user._id;

    if (!isValidObjectId(userId)) return sendError(res, "Invalid User!");

    const users = await User.findById(user);
    const followers = await User.findById(userId);
    if (!users) return sendError(res, "Invalid request, User not found!");

    const index = users.following.indexOf(userId);
    if (index > -1) {
        users.following.splice(index, 1);
        followers.followers.splice(index, 1);
    }
    else {
        users.following.push(userId);
        followers.followers.push(user);
    }

    await users.save();
    await followers.save();

    res.json({user: {id: users._id, name: users.name, email: users.email, isVerified: users.isVerified, role: users.role, avatar: users.avatar?.url, bio: users.bio, following: users.following}, followers: followers.followers})
}