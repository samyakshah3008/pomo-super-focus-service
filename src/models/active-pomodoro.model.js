import { Schema, model } from "mongoose";

const activePomodorosSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
  },
  pausedAt: {
    type: Date,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
  focusTimeInSeconds: {
    type: Number,
    required: true,
  },
  timeLeftInSeconds: {
    type: Number,
  },
});

export const ActivePomodoros = model("ActivePomodoros", activePomodorosSchema);
