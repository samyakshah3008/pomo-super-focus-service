import { Schema, model } from "mongoose";

const gratitudeItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      required: true,
    },
    dateOfCreation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const gratitudeListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gratitudeItems: [gratitudeItemSchema],
  },
  { timestamps: true }
);

export const GratitudeList = model("GratitudeList", gratitudeListSchema);
