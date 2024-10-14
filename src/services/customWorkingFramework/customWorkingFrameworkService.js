import { CustomWorkingFramework } from "../../models/custom-working-framework.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/apiError.js";

const getCustomWorkingFrameworkTemplateService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  const customTemplates = await CustomWorkingFramework.find({ userId });
  return new ApiResponse(
    200,
    { customTemplates: customTemplates.length ? customTemplates : [] },
    customTemplates.length
      ? "Successfully fetched custom templates"
      : "No custom templates found"
  );
};

const getCustomWorkingFrameworkByIdService = async (
  userId,
  customFrameworkId
) => {
  const user = await User.findById(userId);
  if (!user) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  const customFramework = await CustomWorkingFramework.findOne({ userId });
  if (!customFramework || !customFramework.customTemplates?.length) {
    return new ApiResponse(
      200,
      { customTemplates: [] },
      "No custom framework found."
    );
  }

  const customTemplate = customFramework.customTemplates.find(
    (template) => template._id.toString() === customFrameworkId
  );

  if (!customTemplate) {
    return new ApiError(
      404,
      { error: "Custom framework not found" },
      "Custom framework not found"
    );
  }

  return new ApiResponse(200, { customTemplate }, "Custom framework found.");
};

const createCustomWorkingFrameworkService = async (
  userId,
  customWorkTemplateObj
) => {
  const findUser = await User.findById(userId);
  if (!findUser) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  let customFramework = await CustomWorkingFramework.findOne({ userId });
  const isNewFramework = !customFramework;

  if (isNewFramework) {
    customFramework = await CustomWorkingFramework.create({
      userId,
      customTemplates: [customWorkTemplateObj],
    });
  } else {
    customFramework.customTemplates.push(customWorkTemplateObj);
    await customFramework.save();
  }

  findUser.isWorkingFrameworkActivated = true;
  findUser.workingFramework = customWorkTemplateObj?.template;

  await findUser.save();

  const message = isNewFramework
    ? "Successfully created custom working framework"
    : "Successfully updated custom working framework with new template";

  return new ApiResponse(
    isNewFramework ? 201 : 200,
    { customFramework },
    message
  );
};

const updateCustomWorkingFrameworkService = async (
  customWorkTemplateObj,
  customWorkingFrameworkId,
  userId
) => {
  const findUser = await User.findById(userId);
  if (!findUser) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  const customFramework = await CustomWorkingFramework.findOne({ userId });
  if (!customFramework || !customFramework.customTemplates?.length) {
    return new ApiResponse(
      200,
      { customTemplates: [] },
      "No custom framework found."
    );
  }

  const templateIndex = customFramework.customTemplates.findIndex(
    (template) => template._id.toString() === customWorkingFrameworkId
  );

  if (templateIndex === -1) {
    return new ApiError(
      404,
      { error: "Custom framework not found" },
      "Custom framework not found"
    );
  }

  Object.assign(
    customFramework.customTemplates[templateIndex],
    customWorkTemplateObj
  );
  await customFramework.save();

  const updatedTemplate = customFramework.customTemplates[templateIndex];

  if (
    updatedTemplate?.template?.[0]?.title === findUser?.workingFramework?.title
  ) {
    findUser.workingFramework = customWorkTemplateObj?.template;
    findUser.isWorkingFrameworkActivated = true;
    await findUser.save();
  }

  return new ApiResponse(
    200,
    { message: "Custom framework updated successfully" },
    "Custom framework updated successfully"
  );
};

const deleteCustomWorkingFrameworkService = async (
  userId,
  customWorkingFrameworkId
) => {
  const findUser = await User.findById(userId);
  if (!findUser) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  const customFramework = await CustomWorkingFramework.findOne({ userId });
  if (!customFramework || !customFramework.customTemplates?.length) {
    return new ApiResponse(
      200,
      { customTemplates: [] },
      "No custom framework found."
    );
  }

  const templateIndex = customFramework.customTemplates.findIndex(
    (template) => template._id.toString() === customWorkingFrameworkId
  );

  if (templateIndex === -1) {
    return new ApiError(
      404,
      { error: "Custom framework not found" },
      "Custom framework not found"
    );
  }

  const templateToDelete = customFramework.customTemplates[templateIndex];

  if (
    templateToDelete?.template?.[0]?.title === findUser?.workingFramework?.title
  ) {
    await User.updateOne({ _id: userId }, { $unset: { workingFramework: "" } });
    findUser.isWorkingFrameworkActivated = false;
    await findUser.save();
  }

  customFramework.customTemplates.splice(templateIndex, 1);
  await customFramework.save();

  return new ApiResponse(
    200,
    { message: "Custom framework deleted successfully" },
    "Framework deleted successfully"
  );
};

export {
  createCustomWorkingFrameworkService,
  deleteCustomWorkingFrameworkService,
  getCustomWorkingFrameworkByIdService,
  getCustomWorkingFrameworkTemplateService,
  updateCustomWorkingFrameworkService,
};
