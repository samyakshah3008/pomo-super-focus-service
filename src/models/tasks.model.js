import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
});

const TaskListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    taskItems: [TaskSchema],
  },
  { timestamps: true }
);

export const TaskList = model("TaskList", TaskListSchema);
