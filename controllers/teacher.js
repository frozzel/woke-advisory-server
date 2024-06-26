const { isValidObjectId } = require("mongoose");
const Teacher = require("../models/teacher");
const {
  sendError,
  uploadImageToCloud,
  formatTeacher,
} = require("../utils/helper");
const cloudinary = require("../cloud");
const School = require("../models/school");
const ReviewsTeacher = require("../models/reviewsteacher");
const { averageRatingPipelineTeacher } = require("../utils/helper");
const { getAverageRatingsTeacher } = require("../utils/helper");

exports.createTeacher = async (req, res) => {
  const {schoolId} = req.params;
  const { name, about, grade, classType } = req.body;
  const { file } = req;
  const school = await School.findById(schoolId);

  if (!req.user.isVerified)
    return sendError(res, "Please verify you email first!");

  if (!isValidObjectId(schoolId)) return sendError(res, "Invalid School!");

  
  if (!school) return sendError(res, "School not found!", 404);
  

  const newTeacher = new Teacher({ name, about, grade, classType, parentSchool: schoolId });
  
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newTeacher.avatar = { url, public_id };
  }
  school.Teachers.push(newTeacher._id);
  await school.save();

  await newTeacher.save();

  
  res.status(201).json({ teacher: formatTeacher(newTeacher) });
};

// update
// Things to consider while updating.
// No.1 - is image file is / avatar is also updating.
// No.2 - if yes then remove old image before uploading new image / avatar.

exports.updateTeacher = async (req, res) => {
  const { name, about, grade, classType,  } = req.body;
  const { file } = req;
  const { teacherId } = req.params;

  if (!isValidObjectId(teacherId)) return sendError(res, "Invalid request!");

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return sendError(res, "Invalid request, Teacher not found!");

  const public_id = teacher.avatar?.public_id;

  // remove old image if there was one!
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  // upload new avatar if there is one!
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    teacher.avatar = { url, public_id };
  }

  
  teacher.about = about;
  teacher.grade = grade;
  teacher.classType = classType;

  await teacher.save();

  res.status(201).json({teacher: formatTeacher(teacher)});
};

exports.removeTeacher = async (req, res) => {
  const { teacherId } = req.params;

  if (!isValidObjectId(teacherId)) return sendError(res, "Invalid request!");

  const teacher = await teacher.findById(TeacherId);
  if (!teacher) return sendError(res, "Invalid request, record not found!");

  const public_id = teacher.avatar?.public_id;

  // remove old image if there was one!
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  await teacher.findByIdAndDelete(teacherId);

  res.json({ message: "Record removed successfully." });
};

exports.searchTeacher = async (req, res) => {
  const { name } = req.query;
  const { schoolId } = req.params;
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  // if (!name.trim()) return sendError(res, "Invalid request!");
  const result = await Teacher.find({
    name: { $regex: name, $options: "i" },
    parentSchool: schoolId,
   
  });

  const mapTeachers = async (t) => {
    const reviewsTeacher =  await getAverageRatingsTeacher(t._id);
    return {
      id: t._id,
      name: t.name,
      about: t.about,
      grade: t.grade,
      classType: t.classType,
      avatar: t.avatar,
      reviewsTeacher: {...reviewsTeacher},
    };
  };
  const relatedTeachers = await Promise.all(result.map(mapTeachers));

  // const actors = result.map((actor) => formatTeacher(actor));
  res.json({ results: relatedTeachers });
};

exports.getLatestTeachers = async (req, res) => {
  const result = await Teacher.find().sort({ createdAt: "-1" }).limit(12);

  const teachers = result.map((teacher) => formatTeacher(teacher));

  res.json(teachers);
};

exports.getSingleTeacher = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");

  const teacher = await Teacher.findById(id)
    .populate("parentSchool")

    if (!teacher) return sendError(res, "Invalid request, Teacher not found!", 404);

    
    if(teacher.reviewsTeacher.length > 0) {
      
      const [aggregatedResponse] = await ReviewsTeacher.aggregate(
        averageRatingPipelineTeacher(teacher._id)
      );
        
      const reviewsTeacher = {};
      if(!aggregatedResponse)return null;
      if (aggregatedResponse) {
        const { ratingAvg, reviewCount, CRT, trans_grooming, trans_sports, trans_pronouns, globalWarming, anti_parents_rights} = aggregatedResponse;
        reviewsTeacher.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviewsTeacher.reviewCount = reviewCount;
        reviewsTeacher.CRT = CRT;
        reviewsTeacher.trans_grooming = trans_grooming;
        reviewsTeacher.trans_pronouns = trans_pronouns;
        reviewsTeacher.trans_sports = trans_sports;
        reviewsTeacher.globalWarming = globalWarming;
        reviewsTeacher.anti_parents_rights = anti_parents_rights;
        
      }
      const {
        _id,
        name,
        about,
        grade,
        classType,
        avatar,
        parentSchool,
        alertsTeacher,
      } = teacher;

      res.json({
        Teacher: {
        _id,
        name,
        about,
        grade,
        classType,
        avatar,
        parentSchool,
        reviewsTeacher: { ...reviewsTeacher },
        alertsTeacher,
      }});
    } else {
      res.json({Teacher: teacher});
    }
};
  

exports.getTeachers = async (req, res) => {
  const { pageNo, limit } = req.query;

  const teachers = await Teacher.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = teachers.map((teacher) => formatTeacher(teacher));
  res.json({
    profiles,
  });
};

