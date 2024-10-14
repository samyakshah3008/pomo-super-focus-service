import { model, Schema } from "mongoose";

const customWorkingFrameworkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customTemplates: [
      {
        template: Array,
        isLaunched: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export const CustomWorkingFramework = model(
  "CustomWorkingFramework",
  customWorkingFrameworkSchema
);
