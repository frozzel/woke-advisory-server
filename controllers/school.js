const School = require("../models/school");
const { sendError } = require("../utils/error");
const { isValidObjectId } = require("mongoose");


exports.getSingleSchool = async (req, res) => {
    const { schoolId } = req.params;
  
  
    if (!isValidObjectId(schoolId))
      return sendError(res, "School id is not valid!");
  
    const school = await School.findById(schoolId)


  
    res.json({ school });
  };

  exports.searchSchools = async (req, res) => {
    const { SchoolName } = req.query;
  
    if (!SchoolName.trim()) return sendError(res, "Invalid request!");
  
    const schools = await School.find({ SchoolName: { $regex: SchoolName, $options: "i" } });

    res.json({
      results: schools.map((m) => {
        return {
          id: m._id,
          SchoolName: m.SchoolName,
          AddressStreet: m.AddressStreet,
          AddressCity: m.AddressCity,
          AddressState: m.AddressState,
            AddressZip: m.AddressZip,
            AddressZip4: m.AddressZip4,

          
        };
      }),
    });
  };