import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const getUserDetailsService = async (userId) => {
  const findUser = await User.findById(userId);

  if (!findUser) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  return new ApiResponse(200, {
    currentUser: findUser,
  });
};

export { getUserDetailsService };
