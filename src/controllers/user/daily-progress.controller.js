import { getDailyProgressStatsService } from "../../services/user/daily-progress/dailyProgressService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getDailyProgressStatsController = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json(new ApiError(400, { error: "user id is required. " }));
  }

  try {
    const response = await getDailyProgressStatsService(userId);
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
          "something went wrong while getting daily progress stats. "
        )
      );
  }
});

export { getDailyProgressStatsController };
