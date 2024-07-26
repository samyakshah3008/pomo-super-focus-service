import { ActivePomodoros } from "../../models/active-pomodoro.model.js";
import {
  deleteActivePomodoroService,
  getActivePomodoroService,
  initializePomodoroService,
  pausePomodoroService,
  resumePomodoroService,
} from "../../services/pomodoro/activePomodoroService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const initializePomodoro = asyncHandler(async (req, res) => {
  const { userId, focusTimeInSeconds } = req.body;

  try {
    const response = await initializePomodoroService(
      userId,
      focusTimeInSeconds
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(400).json(
      new ApiError(400, {
        message: "something went wrong while initiating the active pomodoro. ",
        error: error?.message,
      })
    );
  }
});

const pauseOrResumePomodoro = asyncHandler(async (req, res) => {
  const { userId, action, timeLeftInSeconds } = req.body;

  if (!userId) {
    return res.status(400).json(
      new ApiError(400, {
        message: "User id is required.",
      })
    );
  }

  if (!action || (action !== "pause" && action !== "resume")) {
    return res.status(400).json(
      new ApiError(400, {
        message: "action should be pause or resume is required. ",
      })
    );
  }

  const findActivePomodoroSession = await ActivePomodoros.findOne({ userId });

  if (!findActivePomodoroSession) {
    return res
      .status(404)
      .json(new ApiError(404, { message: "No active session found" }));
  }

  if (action == "pause") {
    try {
      const response = await pausePomodoroService(userId, timeLeftInSeconds);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res.status(400).json(
        new ApiError(400, {
          message: "something went wrong while pausing a session",
          error: error?.message,
        })
      );
    }
  } else if (action == "resume") {
    try {
      const response = await resumePomodoroService(userId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res.status(400).json(
        new ApiError(400, {
          message: "something went wrong while resuming a session",
          error: error?.message,
        })
      );
    }
  }
});

const deleteActivePomodoro = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.json(new ApiError(400, { message: "user id required. " }));
  }

  try {
    const response = await deleteActivePomodoroService(userId);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(400).json(
      new ApiError(400, {
        message: "something went wrong while deleting the active pomodoro. ",
        error: error?.message,
      })
    );
  }
});

const getActivePomodoro = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  try {
    const response = await getActivePomodoroService(userId);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(500, { message: error?.message || "something went wrong" })
      );
  }
});

export {
  deleteActivePomodoro,
  getActivePomodoro,
  initializePomodoro,
  pauseOrResumePomodoro,
};
