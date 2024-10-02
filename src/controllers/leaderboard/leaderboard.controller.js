import { getLeaderboardOfTheWeekService } from "../../services/leaderboard/leaderboard.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getLeaderboardOfTheWeek = asyncHandler(async (req, res) => {
  try {
    const response = await getLeaderboardOfTheWeekService();
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

export { getLeaderboardOfTheWeek };
