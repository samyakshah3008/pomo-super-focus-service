import {
  getLeaderboardOfTheWeekService,
  getUserRankOfTheWeekService,
} from "../../services/leaderboard/leaderboard.js";
import { ApiError } from "../../utils/ApiError.js";
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

const getUserRankOfTheWeek = asyncHandler(async (req, res) => {
  try {
    const id = req?.user?._id;
    if (!id) {
      throw new ApiError(
        400,
        { message: "User id is required" },
        "User id is required. "
      );
    }
    const response = await getUserRankOfTheWeekService(id);
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

export { getLeaderboardOfTheWeek, getUserRankOfTheWeek };
