import mongoose from "mongoose";

const coreTeamSchema = new mongoose.Schema(
  {
    name : {
      type : String,
      required : true,
      trim : true,
    },

    role : {
      type : String,
      enum : [
        "president",
        "vice_president",
        "secretary",
        "technical_head",
        "event_head",
        "web_head",
        "app_head",
        "dsa_aptitude_head",
        "media_head",
        "sports_head",
      ],
      required : true,
    },

    image : {
      url : {
        type : String,
        required : true,
      },
      publicId : {
        type : String,
        required : true,
      },
    },

    year : {
      type : String,
      required : true,
      trim : true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    department : {
      type : String,
      required : true,
      trim : true,
    },

    bio : {
      type : String,
      default : null,
      trim : true,
    },

    skills : [
      {
        type : String,
        trim : true,
      },
    ],

    linkedin : {
      type : String,
      default : null,
      trim : true,
    },

    github : {
      type: String,
      default : null,
      trim : true,
    },

    leetcode : {
      type : String,
      default : null,
      trim : true,
    },

    portfolio : {
      type : String,
      default : null,
      trim : true,
    },

    resume : {
      type : String,
      default : null,
      trim : true,
    },

    displayOrder : {
      type : Number,
      default : 0,
    },

    createdBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true,
    },
  },
  {
    timestamps : true,
  }
);

const CoreTeam = mongoose.model("CoreTeam", coreTeamSchema);

export default CoreTeam;

