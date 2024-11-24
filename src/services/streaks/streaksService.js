import mongoose from "mongoose";
import { Streak } from "../../models/streak.model.js";
import { SuperFocusUserRecord } from "../../models/super-focus.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getEOD, getYesterdayDateRange } from "../../utils/helper-functions.js";

const logDailyStreakService = async (userId, currentDate) => {
  if (!userId) {
    return new ApiError(400, null, "User ID required. ");
  }

  if (!currentDate) {
    return new ApiError(400, null, "Current Date required. ");
  }
  const streakDetails = await Streak.findOne({ userId });

  if (!streakDetails) {
    const createStreak = new Streak({
      userId: userId,
      lastUpdated: new Date(),
    });

    await createStreak.save();

    return new ApiResponse(
      201,
      { streakDetails: createStreak },
      "New streak details created. "
    );
  }

  const EOD = getEOD(currentDate);

  const lastUpdatedObj = streakDetails.lastUpdated;
  if (EOD > lastUpdatedObj) {
    streakDetails.lastUpdated = EOD;

    const { startOfYesterday, endOfYesterday } = getYesterdayDateRange();

    const results = await SuperFocusUserRecord.aggregate([
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

    if (yesterdayData.totalTime >= streakDetails?.dailyGoalInHours) {
      streakDetails.streakCount = streakDetails.streakCount + 1;
    } else {
      streakDetails.streakCount = 0;
    }

    if (streakDetails.streakCount > streakDetails.highestStreak) {
      streakDetails.highestStreak = streakDetails.streakCount;
    }

    await streakDetails.save();

    return new ApiResponse(200, { streakDetails }, "streak details updated. ");
  } else {
    return new ApiResponse(
      200,
      { streakDetails },
      "Streaks are already updated for today."
    );
  }
};

const updateDailyGoalFocusMinutesService = async (
  userId,
  newGoalFocusTimeInHours
) => {
  const streakDetails = await Streak.findOne({ userId });

  if (!streakDetails) {
    return new ApiError(404, null, "Streak Obj for user not found.");
  }

  streakDetails.dailyGoalInHours = newGoalFocusTimeInHours;
  streakDetails.streakCount = 0;

  await streakDetails.save();

  return new ApiResponse(
    200,
    { streakDetails },
    "New Focus time updated successfully. "
  );
};

export { logDailyStreakService, updateDailyGoalFocusMinutesService };
