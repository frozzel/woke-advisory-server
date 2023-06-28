const mongoose = require('mongoose');// import mongoose
require('@mongoosejs/double');


const schoolSchema = mongoose.Schema({
    FIPS_STATE: {
        type: Number,
        required: false
    },
    FIPS_LEAID: {
        type: Number,
        required: false
    },
    FIPS_SCHOOLID: {
        type: Number,
        required: false
    },
    
    NCES_PRIVATESCHOOLID: {
        type:  mongoose.Schema.Types.Mixed,
        required: false
    },
    SchoolName: {
        type: String,
        required: false,
    },
    AddressStreet: {
        type: String,
        required: false,
        
    },
    AddressCity: {
        type: String,
        required: false,
    },
    backdrop_path: {
        type: String,
        required: false,
        
    },
        
    AddressState: {
        type: String,
        required: false,
        
    },    
    AddressZip: {
        type: Number,
        required: false,
        
    },    
    AddressZip4: {
        type:  mongoose.Schema.Types.Mixed,
        required: false,
        
    },
    SchoolReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "SchoolReviews" }],
    SchoolAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "SchoolAlerts" }],
    Teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teachers" }],
    SchoolURL: {
        type: String,
        required: false,
      },
      AddressLatitude: {
        type: mongoose.Schema.Types.Double,
        required: false,
      },
      AddressLongitude: {
        type: mongoose.Schema.Types.Double,
        required: false,
      },
      DistrictName: {
        type: String,
        required: false,
      },
        DistrictURL: {
        type: String,
        required: false,
        },
        CountyName: {
        type: String,
        required: false,
        },
        Phone: {
        type: String,
        required: false,
        },
        LowGradeServed: {
        type:  mongoose.Schema.Types.Mixed,
        required: false,
        },
        HighGradeServed: {
        type:  mongoose.Schema.Types.Mixed,
        required: false,
        },
        LevelID: {
        type: String,
        required: false,
        },
        Magnet: {
        type: String,
        required: false,
        },
        Charter: {
        type: String,
        required: false,
        },
        Virtual: {
        type: String,
        required: false,
        },
        IsPrivate: {
        type: Boolean,
        required: false,
        },
        SchoolDiggerSchoolURL: {
        type: String,
        required: false,
        },
        PrivateAffiliationDescription: {
        type: String,
        required: false,
        },
        SchoolDiggerDistrictURL: {
        type: String,
        required: false,
        },
    },
    { timestamps: true }
    );

module.exports = mongoose.model('School', schoolSchema);