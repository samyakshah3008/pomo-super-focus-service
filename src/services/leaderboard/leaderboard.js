import { Pomodoros } from "../../models/pomodoro.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getWeekTimeline } from "../../utils/dateUtils.js";

const getLeaderboardOfTheWeekService = async () => {
  try {
    const { startOfWeek, endOfWeek } = getWeekTimeline();

    const leaderboard = await Pomodoros.aggregate([
      {
        $match: {
          date: {
            // $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalTime: { $sum: "$totalTime" },
        },
      },
      {
        $sort: { totalTime: -1 },
      },
      {
        $limit: 30,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalTime: 1,
          userDetails: {
            email: 1,
          },
        },
      },
    ]);
    return new ApiResponse(200, { leaderboardList: leaderboard }, "Success");
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new ApiError(
      500,
      { message: error?.message },
      "Internal server error while fetching leaderboard. "
    );
  }
};

export { getLeaderboardOfTheWeekService };
