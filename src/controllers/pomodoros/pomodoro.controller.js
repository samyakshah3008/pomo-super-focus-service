import {
  getPomodoroReportService,
  logPomodoroSessionService,
} from "../../services/pomodoro/pomodoroService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logPomodoroSession = asyncHandler(async (req, res) => {
  const { userId, sessionTime } = req.body;

  try {
    const response = await logPomodoroSessionService(userId, sessionTime);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error, "error");
    console.log(error?.message, "mesg");
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error?.message,
          "something went wrong while logging pomodoro session"
        )
      );
  }
});

const getPomodoroReport = asyncHandler(async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const response = await getPomodoroReportService(userId, startDate, endDate);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.json(error);
    }
    return res.status(500).json({ success: false, message: error.message });
  }
});

export { getPomodoroReport, logPomodoroSession };
