const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const { getAverageRatingsTeacher } = require("../utils/helper");
const Teacher = require("../models/teacher");
const ReviewSchool = require("../models/reviewschool");
const ReviewsTeacher = require("../models/reviewsteacher");
// const fetch = require('node-fetch');

exports.addReview = async (req, res) => {
  const { teacherId } = req.params;
  const { content, rating,
    CRT, 
    trans_grooming,
    trans_pronouns,
    trans_sports,
    globalWarming,
    anti_parents_rights,
    
    } = req.body;
  const userId = req.user._id;
  const teacher = await Teacher.findOne({ _id: teacherId });
 
  if (!req.user.isVerified) return sendError(res, "Please verify you email first!");


  if(teacher) {

  const isAlreadyReviewed = await ReviewsTeacher.findOne({
    owner: userId,
    parentTeacher: teacher._id,
  });
  if (isAlreadyReviewed)
    return sendError(res, "Invalid request, review is already there!");

  // create and update review.
  const newReview =  new ReviewsTeacher({
    owner: userId,
    parentTeacher: teacher._id,
    content,
    rating,
    CRT,
    trans_grooming,
    trans_pronouns,
    trans_sports,
    globalWarming,
    anti_parents_rights,
    
  });
  
  // updating review for movie.
 
  teacher.reviewsTeacher.push(newReview._id);
  
  await teacher.save();

  // saving new review
  
  await newReview.save();

  const reviews = await getAverageRatingsTeacher(teacher._id);
  
  res.json({ message: "Your review has been added.", reviews });
  } 
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating, CRT, trans_grooming, trans_pronouns, trans_sports, globalWarming, anti_parents_rights} = req.body;
    const userId = req.user._id;
  
    if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review ID!");
  
    const review = await ReviewsTeacher.findOne({ owner: userId, _id: reviewId });
    if (!review) return sendError(res, "Review not found!", 404);
  
    review.content = content;
    review.rating = rating;
    review.CRT = CRT;
    review.trans_grooming = trans_grooming;
    review.trans_pronouns= trans_pronouns;
    review.trans_sports = trans_sports;
    review.globalWarming = globalWarming;
    review.anti_parents_rights = anti_parents_rights;

    await review.save();
  
    res.json({ message: "Your review has been updated." });
  };

exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review ID!");

  const review = await ReviewsTeacher.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Invalid request, review not found!");

  const movie = await Teacher.findById(review.parentTeacher).select("reviewsTeacher");
  
  movie.reviewsTeacher = movie.reviewsTeacher.filter((rId) => rId.toString() !== reviewId);
  
  await ReviewsTeacher.findByIdAndDelete(reviewId);

  await movie.save();

  res.json({ message: "Review removed successfully." });
  };

exports.getReviewsByTeacher = async (req, res) => {
  const { teacherId } = req.params;
  
  if (!isValidObjectId(teacherId)) return sendError(res, "Invalid Teacher ID!");
  
  const movie = await Teacher.findOne({ _id: teacherId })
      .populate({
      path: "reviewsTeacher",
      populate: {
        path: "owner",
        
        
      },
      
    })
    // .select("reviews title");
    
    if (!movie) return null;

  const reviews = movie.reviewsTeacher.map((r) => {
    const { owner, content, rating, CRT,
      trans_grooming,
      trans_pronouns,
      trans_sports,
      globalWarming,
      anti_parents_rights, _id: reviewID } = r;
    const { name, _id: ownerId, avatar } = owner;

    return {
      id: reviewID,
      owner: {
        id: ownerId,
        name,
        avatar,
      },
      content,
      rating,
      CRT,
      trans_grooming,
      trans_pronouns,
      trans_sports,
      globalWarming,
      anti_parents_rights
    };
  });
  
  res.json({ movie: { reviews } })}



exports.getReviewsByUser = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid User ID!");

  const reviewsMovie = await ReviewsTeacher.find({ owner: userId})
    .populate({
      path: "parentTeacher",
      populate: {
        path: "name",
        select: "name",
      },
      
    })
    // .select("SchoolName");
    const reviews = reviewsMovie.map((r) => {
      const { owner, content, rating, CRT, parentTeacher,
        trans_grooming,
        trans_pronouns,
        trans_sports,
        globalWarming,
        anti_parents_rights, _id: reviewID } = r;
      const {  name, id, grade, classType,  } = parentTeacher;
  
      return {
        id: reviewID,
        owner,
        content,
        rating,
        CRT,
        trans_grooming,
        trans_pronouns,
        trans_sports,
        globalWarming,
        anti_parents_rights,
        title: parentTeacher.name,
        parentTeacher: {
          id,
          name,
          grade,
          classType,
          
         
        },
      };
    });

 

  

  res.json({ movie: { reviews } });

};