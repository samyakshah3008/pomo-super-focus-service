import { generateOTP } from "../../../constants.js";
import { OTP } from "../../../models/otp.model.js";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "./signinService.js";

const signupUser = async (userDetails) => {
  const { email, firstName } = userDetails;

  if (!email) {
    throw new ApiError(400, { error: "Email is required" });
  }

  if (!firstName) {
    throw new ApiError(400, { error: "First name is required" });
  }

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (findRegisteredUserWithEmail) {
    return new ApiResponse(200, {
      redirect: true,
      flow: "signup",
      message: "Account already exists",
    });
  }

  await OTP.find({ email }).deleteMany();

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, { otp }, "OTP sent successfully");
};

const verifyOTPAndRegisterUser = async (userDetails, otp) => {
  const { email, firstName, lastName = "" } = userDetails;

  if (!email) {
    throw new ApiError(400, { error: "Email is required" });
  }

  if (!firstName) {
    throw new ApiError(400, { error: "First name is required" });
  }

  if (!otp) {
    throw new ApiError(400, { error: "OTP is required" });
  }

  const findOTP = await OTP.findOne({ email });

  if (!findOTP || !findOTP._id) {
    throw new ApiError(401, { error: "OTP expired, please resend the OTP" });
  }

  if (findOTP.otp !== otp) {
    throw new ApiError(401, { error: "Incorrect OTP, please try again." });
  }

  const user = await User.create({ email, firstName, lastName });

  const registeredUser = await User.findById(user._id).select("-refreshToken");

  if (!registeredUser) {
    throw new ApiError(500, {
      error: "Something went wrong while registering user.",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return {
    accessToken,
    refreshToken,
    registeredUser,
  };
};

const signupGuest = async (guestUser) => {
  const { firstName, lastName, email, isGuestUser = true } = guestUser;

  const user = await User.create({
    firstName,
    lastName,
    isGuestUser,
    email,
  });

  const registeredUser = await User.findById(user._id).select("-refreshToken");

  if (!registeredUser) {
    throw new ApiError(500, {
      error: "Something went wrong while registering user.",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return {
    accessToken,
    refreshToken,
    registeredUser,
  };
};

export { signupGuest, signupUser, verifyOTPAndRegisterUser };
