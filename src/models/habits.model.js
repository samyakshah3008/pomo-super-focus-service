import { Schema, model } from "mongoose";

const habitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
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
  dailyReminder: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: String,
    required: function () {
      return this.dailyReminder;
    },
  },
  categories: {
    type: [String],
    required: true,
  },
  completionStatus: [
    {
      date: { type: Date, required: true },
      isComplete: { type: Boolean, default: false },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Habit = model("Habit", habitSchema);
