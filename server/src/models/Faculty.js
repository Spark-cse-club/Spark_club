import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    name : {
      type : String,
      required  : true, 
      trim : true,
    },

    designation : {
      type : String,
      required : true,
      trim : true,
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

    department : {
      type : String,
      required : true,
      trim : true, 
    },

    email : {
      type : String,
      default : null,
      trim : true,
      lowercase : true,
    },

    bio  :{
      type : String,
      default : null,
      trim : true,
    },

    linkedin: {
      type: String,
      default: null,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Faculty = mongoose.model("Faculty",facultySchema);

export default Faculty;