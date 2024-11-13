import { Schema, model } from "mongoose";

const selfReviewItemSchema = new Schema(
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
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const selfReviewListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    selfReviewItems: [selfReviewItemSchema],
  },
  { timestamps: true }
);

export const SelfReviewList = model("SelfReviewList", selfReviewListSchema);
