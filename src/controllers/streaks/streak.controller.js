import {
  logDailyStreakService,
  updateDailyGoalFocusMinutesService,
} from "../../services/streaks/streaksService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logDailyStreak = asyncHandler(async (req, res) => {
  const { userId, currentDate } = req.query;

  try {
    const response = await logDailyStreakService(userId, currentDate);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong while logging daily streak. "
        )
      );
  }
});

const updateDailyGoalFocusMinutes = asyncHandler(async (req, res) => {
  const { userId, newFocusMinutes } = req.body;

  try {
    const response = await updateDailyGoalFocusMinutesService(
      userId,
      newFocusMinutes
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong while updating daily progress stats. "
        )
      );
  }
});

export { logDailyStreak, updateDailyGoalFocusMinutes };
