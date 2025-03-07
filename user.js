import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Standard User", "Organizer", "System Admin"],
      default: "Standard User",
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
