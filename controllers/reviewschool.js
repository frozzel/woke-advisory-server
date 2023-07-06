const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const { getAverageRatingsSchool } = require("../utils/helper");
const School = require("../models/school");
const ReviewSchool = require("../models/reviewschool");
// const fetch = require('node-fetch');




exports.addReview = async (req, res) => {
  const { schoolId } = req.params;
  const { content, rating,
    CRT, 
    trans_grooming,
    trans_pronouns,
    trans_bathroom,
    globalWarming,
    anti_parents_rights,
    
    } = req.body;
  const userId = req.user._id;
  const school = await School.findOne({ _id: schoolId });
 
  if (!req.user.isVerified) return sendError(res, "Please verify you email first!");


  if(school) {

  const isAlreadyReviewed = await ReviewSchool.findOne({
    owner: userId,
    parentSchool: school._id,
  });
  if (isAlreadyReviewed)
    return sendError(res, "Invalid request, review is already there!");

  // create and update review.
  const newReview =  new ReviewSchool({
    owner: userId,
    parentSchool: school._id,
    content,
    rating,
    CRT,
    trans_grooming,
    trans_pronouns,
    trans_bathroom,
    globalWarming,
    anti_parents_rights,
    
  });
  
  // updating review for movie.
 
  school.SchoolReviews.push(newReview._id);
  
  await school.save();

  // saving new review
  
  await newReview.save();

  const reviews = await getAverageRatingsSchool(school._id);
  
  res.json({ message: "Your review has been added.", reviews });
  } 
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating, CRT, trans_grooming, trans_pronouns, trans_bathroom, globalWarming, anti_parents_rights} = req.body;
    const userId = req.user._id;
  
    if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review ID!");
  
    const review = await ReviewSchool.findOne({ owner: userId, _id: reviewId });
    if (!review) return sendError(res, "Review not found!", 404);
  
    review.content = content;
    review.rating = rating;
    review.CRT = CRT;
    review.trans_grooming = trans_grooming;
    review.trans_pronouns= trans_pronouns;
    review.trans_bathroom = trans_bathroom;
    review.globalWarming = globalWarming;
    review.anti_parents_rights = anti_parents_rights;

    await review.save();
  
    res.json({ message: "Your review has been updated." });
  };

exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review ID!");

  const review = await ReviewSchool.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Invalid request, review not found!");

  const movie = await School.findById(review.parentSchool).select("SchoolReviews");
  
  movie.SchoolReviews = movie.SchoolReviews.filter((rId) => rId.toString() !== reviewId);
  
  await ReviewSchool.findByIdAndDelete(reviewId);

  await movie.save();

  res.json({ message: "Review removed successfully." });
  };

exports.getReviewsBySchool = async (req, res) => {
  const { schoolId } = req.params;
  
  if (!isValidObjectId(schoolId)) return sendError(res, "Invalid School ID!");
  
  const movie = await School.findOne({ _id: schoolId })
      .populate({
      path: "SchoolReviews",
      populate: {
        path: "owner",
        
        
      },
      
    })
    // .select("reviews title");
    
    if (!movie) return null;

  const reviews = movie.SchoolReviews.map((r) => {
    const { owner, content, rating, CRT,
      trans_grooming,
      trans_pronouns,
      trans_bathroom,
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
      trans_bathroom,
      globalWarming,
      anti_parents_rights
    };
  });
  
  res.json({ movie: { reviews } })}



exports.getReviewsByUser = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid User ID!");

  const reviewsMovie = await ReviewSchool.find({ owner: userId})
    .populate({
      path: "parentSchool",
      populate: {
        path: "SchoolName",
        select: "SchoolName",
      },
      
    })
    // .select("SchoolName");
    const reviews = reviewsMovie.map((r) => {
      const { owner, content, rating, CRT, parentSchool,
        trans_grooming,
        trans_pronouns,
        trans_bathroom,
        globalWarming,
        anti_parents_rights, _id: reviewID } = r;
      const {  SchoolName, id, AddressStreet,
        AddressCity,
        AddressState,
        AddressZip,
        AddressZip4, } = parentSchool;
  
      return {
        id: reviewID,
        owner,
        content,
        rating,
        CRT,
        trans_grooming,
        trans_pronouns,
        trans_bathroom,
        globalWarming,
        anti_parents_rights,
        title: parentSchool.SchoolName,
        parentSchool: {
          id,
          SchoolName,
          AddressStreet,
          AddressCity,
          AddressState,
          AddressZip,
          AddressZip4,
         
        },
      };
    });

 

  

  res.json({ movie: { reviews } });

};