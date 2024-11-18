import { Schema, model } from "mongoose";

const habitSchema = new Schema({
  defineHabitText: {
    type: String,
    required: true,
  },
  getSpecificText: {
    type: String,
    required: true,
  },
  identityText: {
    type: String,
    required: true,
  },
  repeat: {
    type: String,
    enum: ["daily", "weekly"],
    required: true,
  },
  selectedDays: {
    type: [String],
    required: true,
  },
});

const habitListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    habitItems: [habitSchema],
  },
  { timestamps: true }
);

export const HabitList = model("HabitList", habitListSchema);
