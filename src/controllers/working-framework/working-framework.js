import { getWorkingFrameworkService } from "../../services/working-framework/workingFrameworkService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getWorkingFrameworkTemplatesController = asyncHandler(
  async (req, res) => {
    try {
      const response = await getWorkingFrameworkService();
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
            "something went wrong while getting working framework template. "
          )
        );
    }
  }
);

export { getWorkingFrameworkTemplatesController };
