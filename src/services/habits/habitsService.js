import { HabitList } from "../../models/habits.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const createHabitService = async (
  userId,
  defineHabitText,
  getSpecificText,
  identityText,
  repeat,
  selectedDays
) => {
  const newHabit = {
    defineHabitText,
    getSpecificText,
    identityText,
    repeat,
    selectedDays,
  };

  let habitList = await HabitList.findOne({ userId });

  if (!habitList) {
    habitList = new HabitList({
      userId,
      habitItems: [newHabit],
    });
  } else {
    habitList.habitItems.push(newHabit);
  }

  await habitList.save();

  const findUser = await User.findById(userId);

  const findItemObj = findUser.checklists.find((item) => item?.key === "habit");
  if (!findItemObj?.completed) {
    findItemObj.completed = true;
    findUser.markModified("checklists");
    await findUser.save();
  }

  return new ApiResponse(201, newHabit, "Successfully created new habit!");
};

const updateHabitService = async (
  userId,
  defineHabitText,
  getSpecificText,
  identityText,
  repeat,
  selectedDays,
  habitId
) => {
  const findUser = await HabitList.findOne({ userId });
  if (!findUser) {
    throw new ApiError(404, {
      message: "Habit list is empty for this user.",
    });
  }

  const particularHabitItem = findUser.habitItems.id(habitId);

  if (!particularHabitItem) {
    throw new ApiError(404, { message: "Habit item not found!" });
  }

  if (defineHabitText !== undefined)
    particularHabitItem.defineHabitText = defineHabitText;
  if (getSpecificText !== undefined)
    particularHabitItem.getSpecificText = getSpecificText;
  if (identityText !== undefined)
    particularHabitItem.identityText = identityText;
  if (repeat !== undefined) particularHabitItem.repeat = repeat;
  if (selectedDays !== undefined)
    particularHabitItem.selectedDays = selectedDays;

  await findUser.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in habit list" },
    "Successfully updated item in habit list"
  );
};

const deleteParticularItemFromHabitListOfUserService = async (
  user,
  habitId
) => {
  const habitList = await HabitList.findOne({ userId: user?._id });

  if (!habitList) {
    throw new ApiError(404, {
      message: "Habit list is empty for this user.",
    });
  }

  const particularHabitItem = habitList.habitItems.id(habitId);

  if (!particularHabitItem) {
    throw new ApiError(404, { message: "Habit item not found!" });
  }

  await particularHabitItem.deleteOne();
  await habitList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in habit list" },
    "Successfully deleted item in habit list"
  );
};

const getTodaysHabitsService = async (userId, today) => {
  const habitList = await HabitList.findOne({ userId });
  if (!habitList) {
    return new ApiResponse(
      200,
      { habits: [] },
      "Successfully fetched todays habits of user"
    );
  }

  const todaysHabits = habitList.habitItems.filter((habit) =>
    habit.selectedDays.includes(today)
  );
  return new ApiResponse(
    200,
    { habits: todaysHabits || [] },
    "Successfully fetched todays habits of user"
  );
};

const getAllHabitsService = async (userId) => {
  const habitList = await HabitList.findOne({ userId });
  if (!habitList) {
    return new ApiResponse(
      200,
      { habits: [] },
      "Successfully fetched all habits of user"
    );
  }

  return new ApiResponse(
    200,
    { habits: habitList?.habitItems || [] },
    "Successfully fetched all habits of user"
  );
};
export {
  createHabitService,
  deleteParticularItemFromHabitListOfUserService,
  getAllHabitsService,
  getTodaysHabitsService,
  updateHabitService,
};
