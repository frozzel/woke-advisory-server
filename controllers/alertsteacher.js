const {isValidObjectId} = require("mongoose");
const {sendError} = require("../utils/helper");
const AlertsSchool = require("../models/alertsschool");
const School = require("../models/school");
const cloudinary = require("../cloud");
const Teacher = require("../models/teacher");
const AlertsTeacher = require("../models/alertsteacher");

const { uploadImageToCloud } = require("../utils/helper");


exports.addAlertsTeacher = async (req, res) => {
    
    const {content} = req.body;
    const {teacherId} = req.params;
    
    const {file,  } = req;
    const userId = req.user._id;

    if (!isValidObjectId(teacherId)) return sendError(res, "Invalid Teacher!");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) return sendError(res, "Teacher not found!");
 
    const alert = new AlertsTeacher({
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

    teacher.alertsTeacher.push(alert._id);
    alert.teacher = teacherId;
    alert.owner = userId;
    alert.content = content;
    
    await teacher.save();
    await alert.save();

    const alert2 = await AlertsTeacher.findById(alert._id).populate("owner", "name avatar").populate("teacher", "name")


    res.status(201).json({alert: alert2});
}

exports.getAlertsTeacher = async (req, res) => {
    const {teacherId} = req.params;
    if (!isValidObjectId(teacherId)) return sendError(res, "Invalid Teacher!");
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return sendError(res, "Teacher not found!");
    const alerts = await AlertsTeacher.find({teacher: teacherId}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar").populate("teacher", "name");
    res.status(200).json({alerts});

}
exports.addComment = async (req, res) => {
    const {alertId} = req.params;
    const {content} = req.body;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsTeacher.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");
    alert.comments.push({user: user._id, content});
    
    await alert.save();

    await alert.populate("comments.user", "name avatar");
    

    res.status(201).json({alert});
}

exports.likeAlert = async (req, res) => {
    const {alertId} = req.params;
    const {user} = req;
    
    if (!isValidObjectId(alertId)) return sendError(res, "Invalid alert!");
    if (!isValidObjectId(user._id)) return sendError(res, "Invalid user!");
    const alert = await AlertsTeacher.findById(alertId);
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
    const alert = await AlertsTeacher.findById(alertId);
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
    const alert = await AlertsTeacher.findById(alertId);
    if (!alert) return sendError(res, "Alert not found!");

    const teacher = await Teacher.findById(alert.teacher);

    if (!teacher) return sendError(res, "Teacher not found!");
    const index = teacher.alertsTeacher.findIndex(alert => alert.toString() === alertId.toString());
    if (index === -1) return sendError(res, "Alert not found in school!");
    teacher.alertsTeacher.splice(index, 1);
    await teacher.save();

    if (alert.owner.toString() !== user._id.toString()) return sendError(res, "You are not authorized to delete this alert!");
    const public_id = alert.image?.public_id;
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }
    await alert.remove();

    // const alerts = await AlertsTeacher.find({teacher: alert.teacher}).populate("owner", "name avatar").populate("comments.user", "name avatar").populate("likes.user", "name avatar").populate("teacher", "name");


    res.status(201).json({"alerts": alert});
}