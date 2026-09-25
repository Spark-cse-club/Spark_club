import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be after or equal to start date",
      },
    },

    category: {
      type: String,
      enum: ["dsa", "aptitude", "other"],
      required: true,
      default: "other",
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    registrationLink: {
      type: String,
      default: null,
      trim: true,
    },

    poster: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
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

const Event = mongoose.model("Event", eventSchema);

export default Event;