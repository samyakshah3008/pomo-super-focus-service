import { Todo } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTodos = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  try {
    const findAllTodosForParticularUser = await Todo.find({ user: userId });

    res.status(200).json(new ApiResponse(200, findAllTodosForParticularUser));
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while finding todos of particular user. "
    );
  }
});

const createNewTodo = asyncHandler(async (req, res) => {
  const { userId, title, description, dueDate, estimatedPomodoros } = req.body;

  if (
    [userId, title, dueDate, estimatedPomodoros].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const todo = new Todo({
    user: userId,
    title,
    description,
    dueDate: new Date(dueDate),
    estimatedPomodoros,
  });

  try {
    await todo.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Todo created successfully"));
  } catch (e) {
    console.log(e);
    throw new ApiError(500, "Something went wrong while creating a todo");
  }
});

export { createNewTodo, getTodos };
