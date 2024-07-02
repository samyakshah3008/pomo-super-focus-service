import { PomodoroSession } from "../models/pomodoro-session.model.js";
import { Pomodoro } from "../models/pomodoro.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const logPomodoroSession = asyncHandler(async (req, res) => {
  const { userId, todoId, duration } = req.body;

  if (!userId || !todoId || !duration) {
    throw new ApiError(400, "userId, todoId, and duration are required.");
  }

  const currentDate = new Date().setHours(0, 0, 0, 0);

  try {
    const newSession = new PomodoroSession({
      userId,
      todoId,
      startTime: new Date(),
      duration,
    });

    await newSession.save();

    const dailyPomodoro = await Pomodoro.findOneAndUpdate(
      {
        userId,
        date: currentDate,
      },
      { $inc: { pomodorosCompleted: 1 } },
      { upsert: true, new: true }
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Pomodoro session logged successfully", {
          newSession,
          dailyPomodoro,
        })
      );
  } catch (e) {
    console.log(e);
    throw new ApiError(
      500,
      "something went wrong while logging pomodoro session"
    );
  }
});
