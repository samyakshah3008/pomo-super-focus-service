import { ActivePomodoros } from "../../models/active-pomodoro.model.js";
import { ApiError } from "../../utils/ApiError.js";
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
  if (!timeLeftInSeconds) {
    return new ApiError(400, { message: "time left in seconds required." });
  }
  const activePomodoro = await ActivePomodoros.findOne({
    userId,
    isPaused: false,
  });

  if (!activePomodoro) {
    return new ApiError(400, { message: "Session is already paused." });
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

const resumePomodoroService = async (userId) => {
  const activePomodoro = await ActivePomodoros.findOne({
    userId,
    isPaused: true,
  });
  if (!activePomodoro) {
    return new ApiError(400, { message: "Session is already running. " });
  }

  activePomodoro.isPaused = false;
  activePomodoro.startTime = new Date();
  activePomodoro.pausedAt = null;

  await activePomodoro.save();
  return new ApiResponse(200, {
    activePomodoro,
    remainingTimeSeconds: activePomodoro.timeLeftInSeconds,
  });
};

const deleteActivePomodoroService = async (userId) => {
  const findActivePomodoroSessionAndDelete =
    await ActivePomodoros.findOneAndDelete(userId);

  if (!findActivePomodoroSessionAndDelete) {
    throw new ApiError(404, { message: "Active pomodoro not found. " });
  }
  return new ApiResponse(200, { message: "Active pomodoro deleted. " });
};

const getActivePomodoroService = async (userId) => {
  if (!userId) {
    return new ApiError(400, { message: "User Id is required. " });
  }

  const currentPomodoro = await ActivePomodoros.find({ userId });
  if (!currentPomodoro?.length) {
    return new ApiResponse(200, {
      message: "No active pomodoro session ongoing. ",
      found: false,
    });
  }
  return new ApiResponse(200, {
    found: true,
    currentPomodoro: currentPomodoro[0],
  });
};

export {
  deleteActivePomodoroService,
  getActivePomodoroService,
  initializePomodoroService,
  pausePomodoroService,
  resumePomodoroService,
};
