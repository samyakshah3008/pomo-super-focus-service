import mongoose from "mongoose";
import { TaskList } from "../../models/tasks.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getTasksOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const tasksList = await TaskList.findOne({ userId });

  return new ApiResponse(
    200,
    { taskItems: tasksList?.taskItems || [] },
    "Successfully fetched tasks"
  );
};

const addTaskToTasksListOfUserService = async (user, taskItem) => {
  const { title, description, isCompleted, dueDate, priority } = taskItem;

  const newTaskItem = {
    title,
    description,
    isCompleted,
    dueDate,
    priority,
  };

  let taskList = await TaskList.findOne({ userId: user?._id });

  if (!taskList) {
    taskList = new TaskList({
      userId: user?._id,
      taskItems: [newTaskItem],
    });
  } else {
    taskList.taskItems.push(newTaskItem);
  }

  await taskList.save();

  const findUser = await User.findById(user?._id);

  const findItemObj = findUser.checklists.find((item) => item?.key === "task");

  if (!findItemObj?.completed) {
    findItemObj.completed = true;
    findUser.markModified("checklists");
    await findUser.save();
  }

  return new ApiResponse(
    201,
    { message: "Successfully added item to tasks list" },
    "Successfully added item to tasks list"
  );
};

const updateParticularTaskFromTaskListOfUserService = async (
  user,
  taskItem,
  taskItemId
) => {
  const { title, description, isCompleted, dueDate, priority } = taskItem;

  const taskList = await TaskList.findOne({ userId: user?._id });

  if (!taskList) {
    throw new ApiError(404, {
      message: "Task list is empty for this user.",
    });
  }

  const particularTaskItem = taskList.taskItems.id(taskItemId);

  if (!particularTaskItem) {
    throw new ApiError(404, { message: "Task item not found!" });
  }

  if (title !== undefined) particularTaskItem.title = title;
  if (description !== undefined) particularTaskItem.description = description;
  if (isCompleted !== undefined) particularTaskItem.isCompleted = isCompleted;
  if (dueDate !== undefined) particularTaskItem.dueDate = dueDate;
  if (priority !== undefined) particularTaskItem.priority = priority;

  await taskList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in task list" },
    "Successfully updated item in task list"
  );
};

const deleteParticularItemFromTaskListOfUserService = async (
  user,
  taskItemId
) => {
  const taskList = await TaskList.findOne({ userId: user?._id });

  if (!taskList) {
    throw new ApiError(404, {
      message: "Task list is empty for this user.",
    });
  }

  const particularTaskItem = taskList.taskItems.id(taskItemId);

  if (!particularTaskItem) {
    throw new ApiError(404, { message: "Task item not found!" });
  }

  await particularTaskItem.deleteOne();
  await taskList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in task list" },
    "Successfully deleted item in task list"
  );
};

const onChangeStatusService = async (user, newStatus, taskId) => {
  const taskList = await TaskList.findOne({ userId: user?._id });

  if (!taskList) {
    throw new ApiError(404, {
      message: "Task list is empty for this user.",
    });
  }

  const particularTaskItem = taskList.taskItems.id(taskId);

  if (!particularTaskItem) {
    throw new ApiError(404, { message: "Task item not found!" });
  }

  particularTaskItem.isCompleted = newStatus;
  await taskList.save();

  return new ApiResponse(
    200,
    { message: "Successfully update item in task list" },
    "Successfully updated item in task list"
  );
};

const onChangePriorityService = async (user, newPriority, taskId) => {
  const taskList = await TaskList.findOne({ userId: user?._id });

  if (!taskList) {
    throw new ApiError(404, {
      message: "Task list is empty for this user.",
    });
  }

  const particularTaskItem = taskList.taskItems.id(taskId);

  if (!particularTaskItem) {
    throw new ApiError(404, { message: "Task item not found!" });
  }

  particularTaskItem.priority = newPriority;
  await taskList.save();

  return new ApiResponse(
    200,
    { message: "Successfully update item in task list" },
    "Successfully updated item in task list"
  );
};

export {
  addTaskToTasksListOfUserService,
  deleteParticularItemFromTaskListOfUserService,
  getTasksOfUserService,
  onChangePriorityService,
  onChangeStatusService,
  updateParticularTaskFromTaskListOfUserService,
};
