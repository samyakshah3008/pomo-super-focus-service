import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get todos of particular user by id

const getTodosOfParticularUser = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new ApiError(400, "User id required");
  }
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

// get a single todo by it's id

const getTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id?.length) {
    throw new ApiError(400, "todo id required");
  }
  try {
    const findTodo = await Todo.findById(id);
    res.status(200).json(new ApiResponse(200, findTodo));
  } catch (e) {
    throw new ApiError(404, "Todo not found");
  }
});

// create a new todo

const createNewTodo = asyncHandler(async (req, res) => {
  const { userId, title, description, dueDate, estimatedPomodoros } = req.body;

  if (!userId) {
    throw new ApiError(400, "User id is required");
  }
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }
  if (!dueDate) {
    throw new ApiError(400, "Due date is required");
  }
  if (!estimatedPomodoros) {
    throw new ApiError(400, "Estimated pomodoros required");
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

// update a particular todo

const updateParticularTodo = asyncHandler(async (req, res) => {
  const { todoId, userId, title, description, dueDate, estimatedPomodoros } =
    req.body;

  if (!todoId) {
    throw new ApiError(400, "Todo Id to update is required. ");
  }
  if (!userId) {
    throw new ApiError(400, "User id is required");
  }
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }
  if (!dueDate) {
    throw new ApiError(400, "Due date is required");
  }
  if (!estimatedPomodoros) {
    throw new ApiError(400, "Estimated pomodoros required");
  }

  try {
    const todo = await Todo.findByIdAndUpdate(
      todoId,
      {
        user: userId,
        title,
        description,
        dueDate: new Date(dueDate),
        estimatedPomodoros,
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      throw new ApiError(404, "Todo not found.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Todo updated successfully"));
  } catch (e) {
    console.error("something went wrong while updating todo. ");
  }
});

// delete a particular todo

const deleteParticularTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.body;

  if (!todoId) {
    throw new ApiError(400, "Todo id is required to delete a todo");
  }

  const findTodoToDelete = await Todo.findByIdAndDelete(todoId);

  if (!findTodoToDelete) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo deleted successfully"));
});

export {
  createNewTodo,
  deleteParticularTodo,
  getTodo,
  getTodosOfParticularUser,
  updateParticularTodo,
};
