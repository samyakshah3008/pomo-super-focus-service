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

const updateUserDetailsService = async (userId, isGreetingModalShown) => {
  const findUser = await User.findById(userId);

  if (!findUser) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  findUser.isGreetingModalShown = isGreetingModalShown;

  await findUser.save();

  return new ApiResponse(
    200,
    { currentUser: findUser },
    "User updated successfully"
  );
};

const activateWorkingFrameworkService = async (userId, workingFramework) => {
  const user = await User.findById(userId);

  if (!user) {
    return new ApiError(404, { error: "User not found" }, "User not found");
  }

  user.isWorkingFrameworkActivated = true;
  user.workingFramework = workingFramework;

  await user.save();

  return new ApiResponse(
    200,
    { currentUser: user },
    "Working framework activated successfully."
  );
};

const updateUserLifeSpanService = async (user, birthDate, estimateLifeSpan) => {
  user.estimateLifeSpan = estimateLifeSpan;
  user.birthDate = birthDate;

  if (!user.isMyLifeOnboardingComplete) {
    user.isMyLifeOnboardingComplete = true;
  }
  await user.save();

  return new ApiResponse(
    200,
    { message: "My life user details saved successfully" },
    "My life user details saved successfully"
  );
};

export {
  activateWorkingFrameworkService,
  getUserDetailsService,
  updateUserDetailsService,
  updateUserLifeSpanService,
};
