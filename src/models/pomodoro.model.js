import { Schema, model } from "mongoose";

const pomodorosSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sessions: {
    type: Number,
    default: 0,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
});

pomodorosSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Pomodoros = model("Pomodoros", pomodorosSchema);
