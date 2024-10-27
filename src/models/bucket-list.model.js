import { Schema, model } from "mongoose";

const bucketItemSchema = new Schema({
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
});

const bucketListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bucketItems: [bucketItemSchema],
  },
  { timestamps: true }
);

export const BucketList = model("BucketList", bucketListSchema);
