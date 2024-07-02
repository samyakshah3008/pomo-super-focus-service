import { Schema, model } from "mongoose";

const pomodoroSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todoId: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const PomodoroSession = model("PomodoroSession", pomodoroSessionSchema);
