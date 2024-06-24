import { mongoose } from "mongoose";
const { Schema, model } = mongoose;

const todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "deleted"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    estimatedPomodoros: {
      type: Number,
      required: [true, "Estimated number of pomodoros is required"],
      min: [1, "At least one estimated pomodoro is required"],
    },
  },
  { timestamps: true }
);

export const Todo = model("Todo", todoSchema);
