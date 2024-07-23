import { ActivePomodoros } from "../../models/active-pomodoro.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const initializePomodoroService = async (userId, focusTimeInSeconds) => {
  const currentTime = new Date();

  if (!userId || !focusTimeInSeconds) {
    throw new ApiError(400, {
      message: "userid and focus time in seconds both are mandatory.",
    });
  }

  const findActivePomodoro = await ActivePomodoros.findOne({ userId });

  if (findActivePomodoro) {
    return new ApiResponse(200, {
      message: "Active pomodoro already exists. ",
    });
  }

  const newActivePomodoroSession = new ActivePomodoros({
    userId,
    focusTimeInSeconds,
    timeLeftInSeconds: focusTimeInSeconds,
    startTime: currentTime,
  });

  await newActivePomodoroSession.save();

  return new ApiResponse(200, {
    message: "Successfully initiated active pomodoro.",
    newActivePomodoroSession,
  });
};

const pausePomodoroService = async (userId, timeLeftInSeconds) => {
  const activePomodoro = await ActivePomodoros.findOne({
    userId,
    isPaused: false,
  });

  if (!activePomodoro) {
    throw new ApiError(404, { message: "Session is already paused." });
  }

  const currentTime = new Date();

  activePomodoro.isPaused = true;
  activePomodoro.pausedAt = currentTime;
  activePomodoro.timeLeftInSeconds = timeLeftInSeconds;

  await activePomodoro.save();
  return new ApiResponse(200, {
    activePomodoro,
    remainingTimeSeconds: activePomodoro.timeLeftInSeconds,
  });
};

const resumePomodoroService = async (userId, timeLeftInSeconds) => {
  const activePomodoro = await ActivePomodoros.findOne({
    userId,
    isPaused: true,
  });
  if (!activePomodoro) {
    return new ApiError(404, { message: "Session is already running. " });
  }

  activePomodoro.isPaused = false;
  activePomodoro.startTime = new Date();
  activePomodoro.timeLeftInSeconds = timeLeftInSeconds;
  activePomodoro.pausedAt = null;

  await activePomodoro.save();
  return new ApiResponse(200, {
    activePomodoro,
    remainingTimeSeconds: activePomodoro.timeLeftInSeconds,
  });
};

const deleteActivePomodoroService = async (activePomodoroId) => {
  const findActivePomodoroSessionAndDelete =
    await ActivePomodoros.findByIdAndDelete(activePomodoroId);

  if (!findActivePomodoroSessionAndDelete) {
    throw new ApiError(404, { message: "Active pomodoro not found. " });
  }
  return new ApiResponse(200, { message: "Active pomodoro deleted. " });
};

export {
  deleteActivePomodoroService,
  initializePomodoroService,
  pausePomodoroService,
  resumePomodoroService,
};
