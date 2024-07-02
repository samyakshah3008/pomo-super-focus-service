import { Schema, model } from "mongoose";

// This model will store the daily count of pomodoros completed by each user.

const pomodoroSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    pomodorosCompleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

pomodoroSchema.index({ user: 1, date: 1 }, { unique: true });

export const Pomodoro = model("Pomodoro", pomodoroSchema);
