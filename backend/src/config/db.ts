import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI!);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1); // Exit with error
  }
};
