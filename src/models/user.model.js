import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: function () {
        return !this.isGuestUser;
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    isGuestUser: {
      type: Boolean,
      default: false,
    },
    isGreetingModalShown: {
      type: Boolean,
      default: false,
    },
    checklists: {
      type: Array,
      default: [
        {
          title:
            "Complete onboarding and accept our request to feed a stray animal. ",
          content: "Welcome onboard!!! Witch is super happy to have you;)",
          completed: true,
        },
        {
          title: "Complete your first pomodoro session!",
          content:
            "Time to bring the focus momentum and kick off with your first pomodoro session!",
          completed: false,
        },
        {
          title:
            "Create your habit - either breaking bad habit or building good habit!",
          content:
            "Time to bring out your best potential! Let's create habits and achieve the best!",
          completed: false,
        },
        {
          title: "Create your working framework!",
          content:
            "It's crucial to create a working framework so you can follow it and make the most of each day!",
          completed: false,
        },
        {
          title: "Create your first goal",
          content:
            "You can't achieve success without clarity. So, create your first goal today!",
          completed: false,
        },
        {
          title: "Create your first task",
          content:
            "Dividing your work in chunks helps to achieve faster. So, create your first task today!",
          completed: false,
        },
      ],
    },
    checklistCompleteCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRTY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
