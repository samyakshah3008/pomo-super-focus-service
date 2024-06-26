import jwt from "jsonwebtoken";
import { generateOTP } from "../constants.js";
import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refreshing tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const findRegisteredUserWithEmail = await User.findOne({
    email,
  });

  if (findRegisteredUserWithEmail) {
    throw new ApiError(409, "User with email already exists");
  }

  const findRegisteredUserWithUsername = await User.findOne({
    username,
  });

  if (findRegisteredUserWithUsername) {
    throw new ApiError(409, "User with username already exists");
  }

  const otp = generateOTP();
  const otpPayload = { email, otp };

  try {
    await OTP.create(otpPayload);

    res.status(200).json({ msg: "OTP sent successfully", otp });
  } catch (error) {
    console.error("something went wrong", error);
  }
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, username, password, otp } = req.body;

  if ([email, username, password, otp].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const findRegisteringEmail = await OTP.findOne({ email });
    if (!findRegisteringEmail._id) {
      return next(new ApiError(401, "OTP expired, please resend the otp"));
    }
    if (findRegisteringEmail.otp !== otp) {
      return next(new ApiError(401, "Incorrect OTP, please try again."));
    }

    const user = await User.create({ email, username, password });

    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!registeredUser) {
      return next(
        new ApiError(500, "Something went wrong while registering a user")
      );
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User registered successfully", registeredUser)
      );
  } catch (err) {
    return next(new ApiError(500, "Something went wrong", err));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "username or email is required. ");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.isCredentialsCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials. ");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In successfully. "
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { loginUser, logoutUser, refreshAccessToken, registerUser, verifyOTP };
