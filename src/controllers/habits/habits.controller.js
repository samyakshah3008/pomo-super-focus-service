import moment from "moment";
import {
  createHabitService,
  deleteHabitService,
  getTodaysHabitsService,
  markHabitCompleteService,
  updateHabitService,
} from "../../services/habits/habitsService.js";
import { ApiError } from "../../utils/apiError.js";

const createHabit = async (req, res) => {
  try {
    const {
      userId,
      title,
      repeat,
      selectedDays,
      dailyReminder,
      reminderTime,
      categories,
    } = req.body;

    if (
      !title ||
      !selectedDays ||
      selectedDays.length === 0 ||
      !categories ||
      categories.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await createHabitService(
      userId,
      title,
      repeat,
      selectedDays,
      dailyReminder,
      reminderTime,
      categories
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
};

const getTodaysHabits = async (req, res) => {
  const {
    userId,
    todayStart = moment().startOf("day"),
    todayEnd = moment().endOf("day"),
    currentDay = todayStart.format("dddd"),
  } = req.query;

  try {
    const response = await getTodaysHabitsService(
      userId,
      todayStart,
      todayEnd,
      currentDay
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
};

const updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const {
      userId,
      title,
      repeat,
      selectedDays,
      dailyReminder,
      reminderTime,
      categories,
    } = req.body;

    if (
      !title ||
      !selectedDays ||
      selectedDays.length === 0 ||
      !categories ||
      categories.length === 0
    ) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const response = await updateHabitService(
      habitId,
      userId,
      title,
      repeat,
      selectedDays,
      dailyReminder,
      reminderTime,
      categories
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
};

const deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  if (!habitId) {
    return res.status(400).json({ error: "Habit id is required!" });
  }

  try {
    const response = await deleteHabitService(habitId);
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
};

const markHabitComplete = async (req, res) => {
  const { habitId } = req.params;
  const { date, isComplete = true } = req.body;

  try {
    const response = markHabitCompleteService(habitId, date, isComplete);
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
};

export {
  createHabit,
  deleteHabit,
  getTodaysHabits,
  markHabitComplete,
  updateHabit,
};
