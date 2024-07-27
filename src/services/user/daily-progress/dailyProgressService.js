import mongoose from "mongoose";
import { Pomodoros } from "../../../models/pomodoro.model.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { getYesterdayDateRange } from "../../../utils/helper-functions.js";

const getDailyProgressStatsService = async (userId) => {
  if (!userId) {
    return new ApiError(400, null, "User ID is required.");
  }
  const { startOfYesterday, endOfYesterday } = getYesterdayDateRange();

  const results = await Pomodoros.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfYesterday },
      },
    },
    {
      $group: {
        _id: {
          $cond: [{ $gte: ["$date", endOfYesterday] }, "today", "yesterday"],
        },
        sessions: { $sum: "$sessions" },
        totalTime: { $sum: "$totalTime" },
      },
    },
  ]);

  const yesterdayData = results.find(
    (result) => result._id === "yesterday"
  ) || { sessions: 0, totalTime: 0 };
  const todayData = results.find((result) => result._id === "today") || {
    sessions: 0,
    totalTime: 0,
  };

  return new ApiResponse(200, {
    yesterday: yesterdayData,
    today: todayData,
  });
};

export { getDailyProgressStatsService };
