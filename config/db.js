import mongoose from "mongoose";
import secrets from "./secrets.js";

const connectDB = () => {
  mongoose
    .connect(secrets.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Database connection error:", err));
};

export default connectDB;