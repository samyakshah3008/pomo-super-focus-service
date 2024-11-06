import { generateOTP } from "../../../constants.js";
import { OTP } from "../../../models/otp.model.js";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";
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

const updateUserBasicInformationService = async (user, firstName, lastName) => {
  user.firstName = firstName;
  user.lastName = lastName;

  await user.save();

  return new ApiResponse(
    200,
    { message: "User details saved successfully" },
    "User details saved successfully"
  );
};

const updateUserEmailInformationService = async (email) => {
  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (findRegisteredUserWithEmail) {
    throw new ApiError(400, {
      message: "Account already exists",
    });
  }

  await OTP.find({ email }).deleteMany();

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, { otp }, "OTP sent successfully");
};

const confirmOTPAndUpdateUserEmailInformationService = async (
  user,
  email,
  otp
) => {
  const findOTP = await OTP.findOne({ email });

  if (!findOTP || !findOTP._id) {
    throw new ApiError(401, { error: "OTP expired, please resend the OTP" });
  }

  if (findOTP.otp !== otp) {
    throw new ApiError(401, { error: "Incorrect OTP, please try again." });
  }

  user.email = email;

  await user?.save();

  return new ApiResponse(
    200,
    { message: "Email updated successfully" },
    "Email updated successfully"
  );
};

export {
  activateWorkingFrameworkService,
  confirmOTPAndUpdateUserEmailInformationService,
  getUserDetailsService,
  updateUserBasicInformationService,
  updateUserDetailsService,
  updateUserEmailInformationService,
  updateUserLifeSpanService,
};
