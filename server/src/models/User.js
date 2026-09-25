import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name : {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: [
        "president",
        "vice_president",
        "technical_head",
        "secretary",
        "faculty",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
