import { cookieOptions } from "../../constants.js";
import {
  refreshAccessToken,
  signinUser,
  signoutUser,
  verifyOtpAndSigninUser,
} from "../../services/user/auth/signinService.js";
import {
  signupUser,
  verifyOTPAndRegisterUser,
} from "../../services/user/auth/signupService.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const signupUserController = asyncHandler(async (req, res) => {
  const { userDetails } = req.body;

  try {
    const response = await signupUser(userDetails);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).send(
      new ApiError(500, {
        error:
          "Something went wrong with servers while sending OTP, please try again later.",
      })
    );
  }
});

const verifyOTPAndRegisterUserController = asyncHandler(
  async (req, res, next) => {
    const { userDetails, otp } = req.body;

    try {
      const { accessToken, refreshToken, registeredUser } =
        await verifyOTPAndRegisterUser(userDetails, otp);

      return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(200, registeredUser, "User registered successfully")
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return next(new ApiError(500, error, "Something went wrong"));
    }
  }
);

const signinUserController = asyncHandler(async (req, res) => {
  const { userDetails } = req.body;

  try {
    const response = await signinUser(userDetails);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).send(
      new ApiError(500, {
        error:
          "Something went wrong with servers while sending OTP, please try again later.",
      })
    );
  }
});

const verifyOTPAndSigninUserController = asyncHandler(
  async (req, res, next) => {
    const { userDetails, otp } = req.body;

    try {
      const { accessToken, refreshToken, findRegisteredUserWithEmail } =
        await verifyOtpAndSigninUser(userDetails, otp);

      return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            findRegisteredUserWithEmail,
            "User Signed in successfully"
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return next(new ApiError(500, "Something went wrong", error));
    }
  }
);

const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  try {
    const { ApiResponse, accessToken, newRefreshToken } =
      await refreshAccessToken(incomingRefreshToken);
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(ApiResponse);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return next(new ApiError(500, error, "Something went wrong"));
  }
});

const logoutUserController = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const response = await signoutUser(userId);
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return next(new ApiError(500, error, "Something went wrong"));
  }
});

export {
  logoutUserController,
  refreshAccessTokenController,
  signinUserController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
};