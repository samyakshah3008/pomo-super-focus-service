import {
  addTaskToTasksListOfUserService,
  deleteParticularItemFromTaskListOfUserService,
  getTasksOfUserService,
  onChangePriorityService,
  onChangeStatusService,
  updateParticularTaskFromTaskListOfUserService,
} from "../../services/tasks/tasksService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getTasksOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getTasksOfUserService(user);
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
          "something went wrong fetching tasks of user"
        )
      );
  }
});

const addTaskToTasksListOfUser = asyncHandler(async (req, res) => {
  const { taskItem } = req.body;
  const user = req?.user;
  const { title, description, isCompleted, dueDate, priority } = taskItem;

  if (
    !title?.length ||
    !description?.length ||
    !dueDate?.length ||
    !priority?.length ||
    typeof isCompleted != "boolean"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addTaskToTasksListOfUserService(user, taskItem);
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
          "something went wrong adding task to tasks list"
        )
      );
  }
});

const updateParticularTaskFromTaskListOfUser = asyncHandler(
  async (req, res) => {
    const { taskItem, taskId } = req.body;
    const user = req?.user;
    const { title, description, isCompleted, dueDate, priority } = taskItem;

    if (
      !title?.length ||
      !description?.length ||
      !dueDate?.length ||
      !priority?.length ||
      typeof isCompleted != "boolean"
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await updateParticularTaskFromTaskListOfUserService(
        user,
        taskItem,
        taskId
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
            "something went wrong updating task to task list"
          )
        );
    }
  }
);

const deleteParticularItemFromTaskListOfUser = asyncHandler(
  async (req, res) => {
    const { taskId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromTaskListOfUserService(
        user,
        taskId
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
            "something went wrong updating item to task list"
          )
        );
    }
  }
);

const onChangeStatus = asyncHandler(async (req, res) => {
  const { newStatus, taskId } = req.body;
  const user = req?.user;

  try {
    const response = await onChangeStatusService(user, newStatus, taskId);
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
          "something went wrong updating task to task list"
        )
      );
  }
});

const onChangePriority = asyncHandler(async (req, res) => {
  const { newPriority, taskId } = req.body;
  const user = req?.user;

  try {
    const response = await onChangePriorityService(user, newPriority, taskId);
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
          "something went wrong updating task to task list"
        )
      );
  }
});

export {
  addTaskToTasksListOfUser,
  deleteParticularItemFromTaskListOfUser,
  getTasksOfUser,
  onChangePriority,
  onChangeStatus,
  updateParticularTaskFromTaskListOfUser,
};
