import { Schema, model } from "mongoose";

const goalItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    doAbleActions: {
      type: String,
      trim: true,
      default: "",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    estimatedTimeToComplete: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const goalListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    goalItems: [goalItemSchema],
  },
  { timestamps: true }
);

export const GoalList = model("GoalList", goalListSchema);
