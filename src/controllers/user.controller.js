import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

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

  const findRegisteredUser = User.findOne({ $or: [{ email }, { username }] });

  if (findRegisteredUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({ email, username, password });

  const registeredUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!registeredUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, registeredUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // validations for empty payload
  // verify the credentials
  // if access token is present -- verify then directly login or else verify credentials and generate new token
});

export { registerUser };
