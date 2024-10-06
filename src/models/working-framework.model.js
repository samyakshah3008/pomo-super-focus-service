import { model, Schema } from "mongoose";
import { workingFrameworkTemplates } from "../constants.js";

const workingFrameworkSchema = new Schema(
  {
    templates: {
      type: Array,
      default: workingFrameworkTemplates,
    },
  },
  { timestamps: true }
);

export const WorkingFramework = model(
  "WorkingFramework",
  workingFrameworkSchema
);
