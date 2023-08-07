const {isValidObjectId} = require("mongoose");
const {sendError} = require("../utils/helper");
const AlertsSchool = require("../models/alertsschool");
const User = require("../models/user");
const cloudinary = require("../cloud");
const Post = require("../models/post");
const { uploadImageToCloud } = require("../utils/helper");
const AlertsTeacher = require("../models/alertsteacher");



exports.addPostUser = async (req, res) => {
    
    const {content} = req.body;
    const {userId} = req.params;
    
    const {file,  } = req;
    // const userId = req.user.id;
    
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

    const user = await User.findById(userId);

    if (!user) return sendError(res, "User not found!");
 
    const alert = new Post({
    });
    

    if (file) {
        const {secure_url: url, public_id} = await cloudinary.uploader.upload(file.path, 
            // {
        //     transformation: {
        //         width: 1280,
        //         height: 720,
        //         crop: "cover"

        //     }
        // }
        );
        alert.image = {url, public_id};
    }

    user.post.push(alert._id);
    alert.owner = userId;
    alert.content = content;
    
    await user.save();
    await alert.save();

    const alert2 = await Post.findById(alert._id).populate("owner", "name avatar")
    res.status(201).json({alert: alert2});
}

exports.getPostUser = async (req, res) => {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) return sendError(res, "Invalid User!");
    const user = await User.findById(userId).populate('teachersFollowing', 'name avatar').populate('schoolsFollowing', 'SchoolName ');
    if (!user) return sendError(res, "User not found!");
    
    const following = [userId, ...user.following.map(user => user._id)];
    const schoolsFollowing = user.schoolsFollowing.map(school => school._id);
    const teachersFollowing = user.teachersFollowing.map(teacher => teacher._id);
    const alerts = await Post.find({owner: following}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar") 
    const alerts2 = await AlertsSchool.find({school: schoolsFollowing}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar").populate("school", "SchoolName");
    const alerts3 = await AlertsTeacher.find({teacher: teachersFollowing}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar").populate("teacher", "name");
    const allAlerts = [...alerts, ...alerts2, ...alerts3];

    allAlerts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })
    // console.log({"alerts": allAlerts});
 
    res.status(200).json({"alerts": allAlerts, following, schoolsFollowing, teachersFollowing});

}
exports.addComment = async (req, res) => {
    const {postId} = req.params;
    const {content} = req.body;
    const {user} = req;
    
    if (!isValidObjectId(postId)) return sendError(res, "Invalid Post!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await Post.findById(postId);
    if (!alert) return sendError(res, "Post not found!");
    alert.comments.push({user: user._id, content});
    
    await alert.save();

    await alert.populate("comments.user", "name avatar");
    

    res.status(201).json({alert});
}

exports.likeAlert = async (req, res) => {
    const {postId} = req.params;
    const {user} = req;
    
    if (!isValidObjectId(postId)) return sendError(res, "Invalid Post!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await Post.findById(postId);
    if (!alert) return sendError(res, "Alert not found!");
    const index = alert.likes.findIndex(like => like.user.toString() === user._id.toString());
    if (index === -1) {
        alert.likes.push({user: user._id});
    } else {
        alert.likes.splice(index, 1);
    }
    await alert.save();
    await alert.populate("likes.user", "name avatar");
    res.status(201).json({alert});
}

exports.editAlert = async (req, res) => {
    const {alertId} = req.params;
    const {content} = req.body;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsSchool.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");
    if (alert.owner.toString() !== user._id.toString()) return sendError(res, "You are not authorized to edit this alert!");
    alert.content = content;

    const public_id = alert.image?.public_id;
    const {file} = req;
    if (public_id && file) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }
    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        alert.image = {url, public_id};
    }

    await alert.save();
    res.status(201).json({alert});
}

exports.deleteAlert = async (req, res) => {
    const {postId} = req.params;
    const {user} = req;
    
    if (!isValidObjectId(postId)) return sendError(res, "Invalid Post!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await Post.findById(postId);
    if (!alert) return sendError(res, "Post not found!");

    const users = await User.findById(alert.owner);

    if (!users) return sendError(res, "User not found!");
    const index = users.post.findIndex(alert => alert.toString() === postId.toString());
    if (index === -1) return sendError(res, "Alert not found in school!");
    users.post.splice(index, 1);
    await users.save();

    if (alert.owner.toString() !== user._id.toString()) return sendError(res, "You are not authorized to delete this alert!");
    const public_id = alert.image?.public_id;
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }
    await alert.remove();
    res.status(201).json({"alerts": alert});
}