import mongoose from "mongoose";
import { Pomodoros } from "../../models/pomodoro.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const logPomodoroSessionService = async (userId, sessionTime) => {
  if (!userId || !sessionTime) {
    throw new ApiError(400, {
      error: "userId, todoId, and duration are required.",
    });
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  let pomodoroSession = await Pomodoros.findOne({
    userId,
    date: { $gte: startOfDay, $lt: endOfDay },
  });

  if (pomodoroSession) {
    pomodoroSession.sessions += 1;
    pomodoroSession.totalTime += sessionTime;
  } else {
    pomodoroSession = new Pomodoros({
      userId,
      date: startOfDay,
      sessions: 1,
      totalTime: sessionTime,
    });
  }

  await pomodoroSession.save();

  return new ApiResponse(200, { pomodoroSession }, "Successful operation");
};

const getPomodoroReportService = async (userId, startDate, endDate) => {
  if (!userId) {
    throw new ApiError(400, { error: "User id is required" });
  }
  if (!startDate) {
    throw new ApiError(400, { error: "Start date is required" });
  }
  if (!endDate) {
    throw new ApiError(400, { error: "End date is required" });
  }

  const report = await Pomodoros.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: new Date(startDate), $lt: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: "$date",
        sessions: { $sum: "$sessions" },
        totalTime: { $sum: "$totalTime" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return new ApiResponse(200, report, "Successful report generated");
};

export { getPomodoroReportService, logPomodoroSessionService };
