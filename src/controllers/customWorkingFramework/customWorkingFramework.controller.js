import {
  createCustomWorkingFrameworkService,
  deleteCustomWorkingFrameworkService,
  getCustomWorkingFrameworkByIdService,
  getCustomWorkingFrameworkTemplateService,
  updateCustomWorkingFrameworkService,
} from "../../services/customWorkingFramework/customWorkingFrameworkService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCustomWorkingFrameworkTemplatesController = asyncHandler(
  async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(
        400,
        new ApiError(
          400,
          { message: "Missing fields, user id is required. " },
          "User id is required"
        )
      );
    }

    try {
      const response = await getCustomWorkingFrameworkTemplateService(userId);
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
            "something went wrong while getting custom working framework templates "
          )
        );
    }
  }
);

const getCustomWorkingFrameworkByIdController = asyncHandler(
  async (req, res) => {
    const { userId, customFrameworkId } = req.query;

    if (!userId || !customFrameworkId) {
      const missingField = !userId ? "User id" : "Custom framework id";
      return res.status(
        400,
        new ApiError(
          400,
          { message: "Missing fields" },
          `${missingField} is required`
        )
      );
    }

    try {
      const response = await getCustomWorkingFrameworkByIdService(
        userId,
        customFrameworkId
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
            "something went wrong while getting custom working framework template by id "
          )
        );
    }
  }
);

const createCustomWorkingFrameworkController = asyncHandler(
  async (req, res) => {
    const { userId, customWorkTemplateObj } = req.body;

    if (!userId || !Object.keys(customWorkTemplateObj).length) {
      return res.status(
        400,
        new ApiError(
          400,
          { message: "Missing fields" },
          "User id and custom work template are both required"
        )
      );
    }

    try {
      const response = await createCustomWorkingFrameworkService(
        userId,
        customWorkTemplateObj
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
            "something went wrong while creating custom working framework template. "
          )
        );
    }
  }
);

const updateCustomWorkingFrameworkController = asyncHandler(
  async (req, res) => {
    const { customWorkTemplateObj, customWorkingFrameworkId, userId } =
      req.body;

    try {
      const response = await updateCustomWorkingFrameworkService(
        customWorkTemplateObj,
        customWorkingFrameworkId,
        userId
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
            "something went wrong while updating custom working framework template. "
          )
        );
    }
  }
);

const deleteCustomWorkingFrameworkController = asyncHandler(
  async (req, res) => {
    const { userId, id } = req.query;

    if (!userId || !id) {
      const missingField = !userId ? "User id" : "ID";
      return res
        .status(400)
        .json({ message: `${missingField} parameter is required` });
    }

    try {
      const response = await deleteCustomWorkingFrameworkService(userId, id);

      return res.status(200).json(response);
    } catch (error) {
      console.error(
        "Controller: Error occurred while deleting framework",
        error
      );

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "Something went wrong while deleting custom working framework template."
          )
        );
    }
  }
);

export {
  createCustomWorkingFrameworkController,
  deleteCustomWorkingFrameworkController,
  getCustomWorkingFrameworkByIdController,
  getCustomWorkingFrameworkTemplatesController,
  updateCustomWorkingFrameworkController,
};
