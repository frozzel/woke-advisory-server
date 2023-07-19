const {isValidObjectId} = require("mongoose");
const {sendError} = require("../utils/helper");
const AlertsSchool = require("../models/alertsschool");
const School = require("../models/school");
const User = require("../models/user");
const cloudinary = require("../cloud");

const { uploadImageToCloud } = require("../utils/helper");


exports.addAlertsSchool = async (req, res) => {
    
    const {content} = req.body;
    const {schoolId} = req.params;
    
    const {file,  } = req;
    const userId = req.user._id;

    if (!isValidObjectId(schoolId)) return sendError(res, "Invalid school!");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

    const school = await School.findById(schoolId);

    if (!school) return sendError(res, "School not found!");
 
    const alert = new AlertsSchool({
    });
    

    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        alert.image = {url, public_id};
    }

    school.alertsSchool.push(alert._id);
    alert.school = schoolId;
    alert.owner = userId;
    alert.content = content;
    
    await school.save();
    await alert.save();
    res.status(201).json({alert});
}

exports.getAlertsSchool = async (req, res) => {
    const {schoolId} = req.params;
    if (!isValidObjectId(schoolId)) return sendError(res, "Invalid school!");
    const school = await School.findById(schoolId);
    if (!school) return sendError(res, "School not found!");
    const alerts = await AlertsSchool.find({school: schoolId}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar").populate("school", "SchoolName");
    res.status(200).json({alerts});

}
exports.addComment = async (req, res) => {
    const {alertId} = req.params;
    const {content} = req.body;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsSchool.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");
    alert.comments.push({user: user._id, content});
    
    await alert.save();
    res.status(201).json({alert});
}

exports.likeAlert = async (req, res) => {
    const {alertId} = req.params;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsSchool.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");
    const index = alert.likes.findIndex(like => like.user.toString() === user._id.toString());
    if (index === -1) {
        alert.likes.push({user: user._id});
    } else {
        alert.likes.splice(index, 1);
    }
    await alert.save();
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
    const {alertId} = req.params;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsSchool.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");

    const school = await School.findById(alert.school);

    if (!school) return sendError(res, "School not found!");
    const index = school.alertsSchool.findIndex(alert => alert.toString() === alertId.toString());
    if (index === -1) return sendError(res, "Alert not found in school!");
    school.alertsSchool.splice(index, 1);
    await school.save();

    if (alert.owner.toString() !== user._id.toString()) return sendError(res, "You are not authorized to delete this alert!");
    const public_id = alert.image?.public_id;
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }
    await alert.remove();
    res.status(201).json({alert});
}