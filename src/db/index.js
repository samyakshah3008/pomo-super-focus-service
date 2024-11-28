import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n MongoDB connected: !! DB Host `);
  } catch (error) {
    console.error("MONGODB Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
