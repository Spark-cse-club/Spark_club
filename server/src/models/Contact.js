
import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
  {
    name :{
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },

  },
  {
    timestamps: true,
  }
)

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
