import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://samyakshah3008:qtO2cNVGp5k2WuAx@pomosuperfocuscluster.cfigglv.mongodb.net/POMO_SUPER_FOCUS_DB"
    );
    console.log(process.env.MONGODB_URI, "skwdn");
    console.log(`\n MongoDB connected: !! DB Host `);
  } catch (error) {
    console.error("MONGODB Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
