const School = require("../models/school");
const { sendError } = require("../utils/error");
const { isValidObjectId } = require("mongoose");
const { averageRatingPipelineSchool, getAverageRatingsSchool } = require("../utils/helper");
const ReviewSchool = require("../models/reviewschool");



exports.getSingleSchool = async (req, res) => {
    const { schoolId } = req.params;
  
  
    if (!isValidObjectId(schoolId))
      return sendError(res, "School id is not valid!");
  
    const school = await School.findById(schoolId)

    if(school.SchoolReviews.length > 0) {
      const [aggregatedResponse] = await ReviewSchool.aggregate(
        averageRatingPipelineSchool(school._id)
      );

      const SchoolReviews = {};
      if(!aggregatedResponse)return null;
      if (aggregatedResponse) {
        const { ratingAvg, reviewCount, CRT, trans_grooming, trans_bathroom, trans_pronouns, globalWarming, anti_parents_rights} = aggregatedResponse;
        SchoolReviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        SchoolReviews.reviewCount = reviewCount;
        SchoolReviews.CRT = CRT;
        SchoolReviews.trans_grooming = trans_grooming;
        SchoolReviews.trans_pronouns = trans_pronouns;
        SchoolReviews.trans_bathroom = trans_bathroom;
        SchoolReviews.globalWarming = globalWarming;
        SchoolReviews.anti_parents_rights = anti_parents_rights;
        
      } 
    const {
          _id,
          FIPS_STATE,
          FIPS_LEAID,
          FIPS_SCHOOLID,
          SchoolName,
          AddressStreet,
          AddressCity,
          AddressState,
          AddressZip,
          AddressZip4,
          SchoolURL,
          AddressLatitude,
          AddressLongitude,
          DistrictName,
          DistrictURL,
          CountyName,
          Phone,
          LowGradeServed,
          HighGradeServed,
          LevelID,
          Magnet,
          Charter,
          Virtual,
          IsPrivate,
          SchoolDiggerSchoolURL,
          SchoolDiggerDistrictURL
        } = school;

        res.json({ 
          school: { 
          _id,
          FIPS_STATE,
          FIPS_LEAID,
          FIPS_SCHOOLID,
          SchoolName,
          AddressStreet,
          AddressCity,
          AddressState,
          AddressZip,
          AddressZip4,
          SchoolURL,
          AddressLatitude,
          AddressLongitude,
          DistrictName,
          DistrictURL,
          CountyName,
          Phone,
          LowGradeServed,
          HighGradeServed,
          LevelID,
          Magnet,
          Charter,
          Virtual,
          IsPrivate,
          SchoolDiggerSchoolURL,
          SchoolDiggerDistrictURL,
          SchoolReviews: {...SchoolReviews}
        }});
      } else {
     


  
    res.json({ school });
  }
  };

exports.searchSchools = async (req, res) => {
    const { SchoolName } = req.query;
  
    if (!SchoolName.trim()) return sendError(res, "Invalid request!");
  
    const schools = await School.find({ SchoolName: { $regex: SchoolName, $options: "i" } });


    const mapSchools = async (s) => {
      
      const reviews =  await getAverageRatingsSchool(s._id);
      
      return {
        id: s._id,
        SchoolName: s.SchoolName,
        AddressStreet: s.AddressStreet,
        AddressCity: s.AddressCity,
        AddressState: s.AddressState,
        AddressZip: s.AddressZip,
        AddressZip4: s.AddressZip4,
        reviews: {...reviews},
      };
    };

    const relatedSchools = await Promise.all(schools.map(mapSchools));
    
    res.json({ results: relatedSchools });

    
  };