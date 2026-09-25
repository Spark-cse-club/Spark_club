import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title : {
      type : String,
      required : true,
      trim : true,
    },

    description : {
      type : String,
      required : true,
      trim : true,
    },

    category : {
      type : String,
      enum : [
        "placement",
        "competition",
        "hackathon",
        "exam",
        "open_source",
        "research",
        "certification",
        "internship",
        "award",
        "other",
      ],
      required  : true,
    },
     
    achievementDate : {
      type : Date,
      required : true,
    },

    personName :{ 
      type : String,
      default : null,
      trim : true,
    },

    teamName : {
      type : String,
      default : null,
      trim : true,
    },

    organization: {
      type: String,
      default: null,
      trim: true,
    },

    rank : {
      type : String,
      default : null,
      trim : true,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            default: null,
          },
          publicId: {
            type: String,
            default: null,
          },
        },
      ],
      validate: {
        validator: function (value) {
          return value.length <= 4;
        },
        message: "Maximum 4 images are allowed",
      },
    },
    
    link : {
      type : String,
      default : null,
      trim : true,
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

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;

