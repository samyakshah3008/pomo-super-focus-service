import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { checklistsConstants } from "../constants.js";

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
      default: checklistsConstants,
    },
    checklistCompleteCount: {
      type: Number,
      default: 1,
    },
    isWorkingFrameworkActivated: {
      type: Boolean,
      default: false,
    },
    workingFramework: {
      type: Object,
    },
    birthDate: {
      type: String,
    },
    estimateLifeSpan: {
      type: Number,
    },
    isMyLifeOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    hasBetaAccess: {
      type: Boolean,
      default: false,
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
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
