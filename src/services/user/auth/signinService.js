import { generateOTP } from "../../../constants.js";
import { OTP } from "../../../models/otp.model.js";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      error,
      "Something went wrong while generating access and refreshing tokens"
    );
  }
};

const signinUser = async (userDetails) => {
  const { email } = userDetails;
  if (!email) {
    throw new ApiError(400, { error: "Email is required" });
  }

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (!findRegisteredUserWithEmail) {
    return new ApiResponse(
      200,
      {
        redirect: true,
        flow: "signin",
        message: "Account doesn't exists",
      },
      "Redirect to signup"
    );
  }

  await OTP.findOneAndDelete({ email });

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, {}, "OTP sent successfully");
};

const verifyOtpAndSigninUser = async (userDetails, otp) => {
  const { email } = userDetails;

  if (!otp) {
    throw new ApiError(400, { error: "otp is required" });
  }

  if (!email) {
    throw new ApiError(400, { error: "Email is required" });
  }

  const findOTP = await OTP.findOne({ email });

  if (!findOTP || !findOTP._id) {
    throw new ApiError(400, { error: "OTP expired, please resend the OTP" });
  }

  if (findOTP.otp !== otp) {
    throw new ApiError(400, { error: "Incorrect OTP, please try again." });
  }

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (!findRegisteredUserWithEmail) {
    throw new ApiError(404, { error: "Registering user not found" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    findRegisteredUserWithEmail._id
  );

  return { findRegisteredUserWithEmail, accessToken, refreshToken };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, { error: "Unauthorized" });
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(400, { error: "Invalid refresh token" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, { error: "Refresh token is expired or used" });
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const ApiResponse = new ApiResponse(
      200,
      { accessToken, newRefreshToken },
      "Access token refreshed"
    );

    return { ApiResponse, accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(400, { error: "Invalid refresh token" });
  }
};

const signoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return new ApiResponse(200, {}, "User logged out successfully");
};

export {
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  signinUser,
  signoutUser,
  verifyOtpAndSigninUser,
};
