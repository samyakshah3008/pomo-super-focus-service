import moment from "moment";
import {
  createHabitService,
  deleteParticularItemFromHabitListOfUserService,
  getAllHabitsService,
  getTodaysHabitsService,
  updateHabitService,
} from "../../services/habits/habitsService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createHabit = asyncHandler(async (req, res) => {
  const {
    defineHabitText,
    getSpecificText,
    identityText,
    repeat,
    selectedDays,
  } = req.body;
  const userId = req?.user?._id;

  if (
    !defineHabitText?.length ||
    !getSpecificText?.length ||
    !identityText?.length ||
    !repeat?.length ||
    !selectedDays?.length
  ) {
    return res.status(400).json(new ApiError(400, null, "Missing fields!"));
  }

  try {
    const response = await createHabitService(
      userId,
      defineHabitText,
      getSpecificText,
      identityText,
      repeat,
      selectedDays
    );
    return res.status(201).json(response);
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
const updateHabit = asyncHandler(async (req, res) => {
  const {
    defineHabitText,
    getSpecificText,
    identityText,
    repeat,
    selectedDays,
    habitId,
  } = req.body;
  const userId = req?.user?._id;

  if (
    !defineHabitText?.length ||
    !getSpecificText?.length ||
    !identityText?.length ||
    !repeat?.length ||
    !selectedDays?.length
  ) {
    return res.status(400).json(new ApiError(400, null, "Missing fields!"));
  }

  try {
    const response = await updateHabitService(
      userId,
      defineHabitText,
      getSpecificText,
      identityText,
      repeat,
      selectedDays,
      habitId
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

const deleteHabit = asyncHandler(async (req, res) => {
  const { habitId } = req.query;
  const user = req?.user;

  try {
    const response = await deleteParticularItemFromHabitListOfUserService(
      user,
      habitId
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
          "something went wrong updating item to habit list"
        )
      );
  }
});

const getTodaysHabits = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const today = moment().format("ddd");
    const response = await getTodaysHabitsService(userId, today);
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
          "something went wrong fetching item from habit list"
        )
      );
  }
});

const getAllHabits = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const response = await getAllHabitsService(userId);
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
          "something went wrong fetching item from habit list"
        )
      );
  }
});

export { createHabit, deleteHabit, getAllHabits, getTodaysHabits, updateHabit };
