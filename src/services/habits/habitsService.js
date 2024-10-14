import moment from "moment";
import { Habit } from "../../models/habits.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const createHabitService = async (
  userId,
  title,
  repeat,
  selectedDays,
  dailyReminder,
  reminderTime,
  categories
) => {
  const newHabit = new Habit({
    userId,
    title,
    repeat,
    selectedDays,
    dailyReminder,
    reminderTime: dailyReminder ? reminderTime : null,
    categories,
  });

  await newHabit.save();

  return new ApiResponse(200, newHabit, "Successfully created new habit!");
};

const getTodaysHabitsService = async (
  userId,
  todayStart,
  todayEnd,
  currentDay
) => {
  const habits = await Habit.find({ userId });

  const todaysHabits = habits.filter(
    (habit) =>
      habit.repeat === "daily" ||
      (habit.repeat === "weekly" &&
        habit.selectedDays.includes(currentDay.slice(0, 3)))
  );

  if (!todaysHabits.length) {
    return new ApiResponse(
      200,
      { complete: [], incomplete: [] },
      "Successfully fetched"
    );
  }

  const completeHabits = [];
  const incompleteHabits = [];

  todaysHabits.forEach((habit) => {
    const todayCompletion = habit.completionStatus?.find((status) =>
      moment(status.date).isBetween(todayStart, todayEnd, null, "[]")
    );

    if (todayCompletion && todayCompletion.isComplete) {
      completeHabits.push(habit);
    } else {
      incompleteHabits.push(habit);
    }
  });

  return new ApiResponse(
    200,
    { complete: completeHabits, incomplete: incompleteHabits },
    "Successfully fetched"
  );
};

const updateHabitService = async (
  habitId,
  userId,
  title,
  repeat,
  selectedDays,
  dailyReminder,
  reminderTime,
  categories
) => {
  const habit = await Habit.findByIdAndUpdate(
    habitId,
    {
      userId,
      title,
      repeat,
      selectedDays,
      dailyReminder,
      reminderTime: dailyReminder ? reminderTime : null,
      categories,
    },
    { new: true, runValidators: true }
  );

  if (!habit) {
    throw new ApiError(404, { message: "Habit not found" }, "Habit not found");
  }

  return new ApiResponse(
    200,
    { message: "Habit updated successfully", habit },
    "Successfully updated"
  );
};

const deleteHabitService = async (habitId) => {
  const habit = await Habit.findByIdAndDelete(habitId);

  if (!habit) {
    throw new ApiError(404, { message: "Habit not found" }, "Habit not found");
  }

  return new ApiResponse(200, { message: "Habit deleted successfully" });
};

const markHabitCompleteService = async (habitId, date, isComplete) => {
  const habit = await Habit.findById(habitId);

  if (!habit) {
    throw new ApiError(404, { error: "Habit not found" });
  }

  const completionEntry = habit.completionStatus.find(
    (entry) => entry.date.toISOString().split("T")[0] === date.split("T")[0]
  );

  if (completionEntry) {
    completionEntry.isComplete = isComplete;
  } else {
    habit.completionStatus.push({ date: new Date(date), isComplete });
  }

  await habit.save();
  return new ApiResponse(200, { message: "Habit status updated successfully" });
};

export {
  createHabitService,
  deleteHabitService,
  getTodaysHabitsService,
  markHabitCompleteService,
  updateHabitService,
};
