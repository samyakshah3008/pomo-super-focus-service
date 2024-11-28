import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n MongoDB connected: !! DB Host `);
  } catch (error) {
    console.error("MONGODB Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
