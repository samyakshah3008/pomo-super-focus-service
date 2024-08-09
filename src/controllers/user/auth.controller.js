import { cookieOptions } from "../../constants.js";
import {
  refreshAccessToken,
  signinUser,
  signoutUser,
  verifyOtpAndSigninUser,
} from "../../services/user/auth/signinService.js";
import {
  signupGuest,
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
      new ApiError(500, error, {
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
      const user = registeredUser;

      return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken, user },

            "User registered successfully"
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return next(new ApiError(500, error, "Something went wrong"));
    }
  }
);

const signupGuestController = asyncHandler(async (req, res) => {
  try {
    const { accessToken, refreshToken, registeredUser } = await signupGuest();
    const user = registeredUser;

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken, user },
          "User registered successfully"
        )
      );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).send(
      new ApiError(500, error, {
        error:
          "Something went wrong with servers while sending OTP, please try again later.",
      })
    );
  }
});

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
      new ApiError(500, error, {
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
      const user = findRegisteredUserWithEmail;
      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken, user },
            "User Signed in successfully"
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return next(new ApiError(500, error, "Something went wrong"));
    }
  }
);

const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  try {
    const { response, accessToken, refreshToken } = await refreshAccessToken(
      incomingRefreshToken
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(response);
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
  signupGuestController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
};
