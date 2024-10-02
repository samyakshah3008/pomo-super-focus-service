import { model, Schema } from "mongoose";

const leaderboardSchema = new Schema(
  {
    userId: {
      Types: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaderboard: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const Leaderboard = model("Leaderboard", leaderboardSchema);
