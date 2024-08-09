import { model, Schema } from "mongoose";

const streakSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dailyGoalInHours: {
      type: Number,
      default: 1,
    },
    lastUpdated: {
      type: Date,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    highestStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Streak = model("Streak", streakSchema);
