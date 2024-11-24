import { defaultSettings } from "../../constants.js";
import { ActivePomodoros } from "../../models/active-pomodoro.model.js";
import { SuperFocusUserRecord } from "../../models/super-focus.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const fetchSuperFocusDetailsService = async (userId) => {
  const findSuperFocusRecordOfUser = await SuperFocusUserRecord.findOne({
    userId,
  });
  if (!findSuperFocusRecordOfUser) {
    // create new
    let prepareSuperFocusRecordDetails = {
      userId,
      settings: defaultSettings,
      pomodoroItems: [],
    };

    const createNewRecord = await SuperFocusUserRecord.create(
      prepareSuperFocusRecordDetails
    );
    return new ApiResponse(
      201,
      { superFocusRecordDetails: createNewRecord?.settings },
      "Successfully fetched"
    );
  } else {
    return new ApiResponse(
      200,
      { superFocusRecordDetails: findSuperFocusRecordOfUser?.settings },
      "Successfully fetched"
    );
  }
};

const getActivePomodoroService = async (userId) => {
  const currentPomodoro = await ActivePomodoros.findOne({ userId });
  if (!currentPomodoro?._id) {
    return new ApiResponse(200, {
      message: "No active pomodoro session ongoing. ",
      found: false,
    });
  }
  return new ApiResponse(200, {
    found: true,
    currentPomodoro: currentPomodoro,
  });
};

const initializePomodoroService = async (userId, focusTimeInSeconds) => {
  const currentTime = new Date();

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
    await ActivePomodoros.findOneAndDelete({ userId });

  if (!findActivePomodoroSessionAndDelete) {
    throw new ApiError(404, { message: "Active pomodoro not found. " });
  }
  return new ApiResponse(200, { message: "Active pomodoro deleted. " });
};

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

  await ActivePomodoros.findOneAndDelete({ userId });

  return new ApiResponse(
    200,
    { pomodoroSession },
    "Successfully saved completed pomodoro to DB."
  );
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

export {
  deleteActivePomodoroService,
  fetchSuperFocusDetailsService,
  getActivePomodoroService,
  getPomodoroReportService,
  initializePomodoroService,
  logPomodoroSessionService,
  pausePomodoroService,
  resumePomodoroService,
};
