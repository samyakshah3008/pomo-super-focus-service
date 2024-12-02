import { ActivePomodoros } from "../../models/active-pomodoro.model.js";
import { SuperFocusUserRecord } from "../../models/super-focus.model.js";
import { User } from "../../models/user.model.js";
import {
  deleteActivePomodoroService,
  fetchSuperFocusDetailsService,
  getActivePomodoroService,
  getPomodoroReportService,
  initializePomodoroService,
  logPomodoroSessionService,
  pausePomodoroService,
  resumePomodoroService,
} from "../../services/superFocus/superFocusService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const fetchSuperFocusDetails = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  try {
    const response = await fetchSuperFocusDetailsService(userId);
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
          "something went wrong fetching super focus record details"
        )
      );
  }
});

const addPomodoro = asyncHandler(async (req, res) => {
  const { studyFocusTime } = req.body;
  const userId = req?.user?._id;

  await ActivePomodoros.findOneAndDelete({ userId });

  const findSuperFocusUserRecord = await SuperFocusUserRecord.findOne({
    userId,
  });

  if (!findSuperFocusUserRecord) {
    return res.status(404).json({ message: "User record not found" });
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Get today's pomodoros
  const todaysPomodoros = findSuperFocusUserRecord.userPomodorosRecord.filter(
    (pomodoro) => pomodoro.date >= startOfDay && pomodoro.date <= endOfDay
  );

  // Calculate if it's time for a long break
  const longBreakInterval =
    findSuperFocusUserRecord.settings?.breakOptions?.longBreakInterval || 4;
  const shouldGoToLongBreak =
    (todaysPomodoros.length + 1) % longBreakInterval === 0;

  // Add the new pomodoro
  const prepareNewPomodoro = {
    date: new Date(),
    focusTime: studyFocusTime,
  };
  findSuperFocusUserRecord.userPomodorosRecord.push(prepareNewPomodoro);
  await findSuperFocusUserRecord.save();

  const findUser = await User.findById(userId);

  const findItemObj = findUser.checklists.find(
    (item) => item?.key === "pomodoro"
  );

  if (!findItemObj?.completed) {
    findItemObj.completed = true;
    findUser.markModified("checklists");
    await findUser.save();
  }

  return res.status(200).json({
    message: "New pomodoro completed and added successfully!",
    shouldGoToLongBreak,
    todaySessionCompletedCount: todaysPomodoros.length + 1,
  });
});

const updateSuperFocusSettings = asyncHandler(async (req, res) => {
  const { newSettings } = req.body;
  const userId = req?.user?._id;

  const findSuperFocusUserRecord = await SuperFocusUserRecord.findOne({
    userId,
  });

  findSuperFocusUserRecord.settings = newSettings;
  await findSuperFocusUserRecord.save();
  return res.status(200).json({ message: "settings saved successfully!" });
});

const initializePomodoro = asyncHandler(async (req, res) => {
  const { focusTimeInSeconds } = req.body;
  const userId = req?.user?._id;

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
  const { action, timeLeftInSeconds } = req.body;
  const userId = req?.user?._id;

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
  const userId = req?.user?._id;

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
  const userId = req?.user?._id;

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

const logPomodoroSession = asyncHandler(async (req, res) => {
  const { userId, sessionTime } = req.body;

  try {
    const response = await logPomodoroSessionService(userId, sessionTime);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error, "error from log pomodoro session");
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

export {
  addPomodoro,
  deleteActivePomodoro,
  fetchSuperFocusDetails,
  getActivePomodoro,
  initializePomodoro,
  pauseOrResumePomodoro,
  updateSuperFocusSettings,
};
