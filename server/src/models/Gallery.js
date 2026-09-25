import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "event",
        "workshop",
        "hackathon",
        "competition",
        "celebration",
        "other",
      ],
      required: true,
    },

    eventName: {
      type: String,
      default: null,
      trim: true,
    },

    eventDate: {
      type: Date,
      default: null,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },

          publicId: {
            type: String,
            required: true,
          },
        },
      ],
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 4;
        },
        message: "Gallery must have between 1 and 4 images",
      },
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

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;