import {
  activateWorkingFrameworkService,
  confirmOTPAndUpdateUserEmailInformationService,
  getUserDetailsService,
  updateUserBasicInformationService,
  updateUserDetailsService,
  updateUserEmailInformationService,
  updateUserLifeSpanService,
} from "../../services/user/userData/userDataService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserDetailsController = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { error: "User Id is required" },
          "User ID is required."
        )
      );
  }

  try {
    const response = await getUserDetailsService(userId);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong while getting daily progress stats. "
        )
      );
  }
});

const updateUserDetailsController = asyncHandler(async (req, res) => {
  const { userId, isGreetingModalShown } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { error: "User Id is required" },
          "User ID is required."
        )
      );
  }

  try {
    const response = await updateUserDetailsService(
      userId,
      isGreetingModalShown
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong while getting daily progress stats. "
        )
      );
  }
});

const activateWorkingFrameworkController = asyncHandler(async (req, res) => {
  const { userId, workingFramework } = req.body;

  if (!userId || !Object.keys(workingFramework)?.length) {
    return res.status(400).json(
      new ApiError(
        400,
        {
          error:
            "Missing fields, both user id and working framework is required. ",
        },
        "User ID is required."
      )
    );
  }

  try {
    const response = await activateWorkingFrameworkService(
      userId,
      workingFramework
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong while activating working framework! "
        )
      );
  }
});

const updateUserLifeSpanController = asyncHandler(async (req, res) => {
  const { birthDate, estimateLifeSpan } = req.body;
  if (!birthDate || !estimateLifeSpan) {
    return res.status(400).json(
      new ApiError(
        400,
        {
          error:
            "Missing fields, both user birthdate and estimate life span is required. ",
        },
        "Missing fields, both user birthdate and estimate life span is required. "
      )
    );
  }

  try {
    const response = await updateUserLifeSpanService(
      req?.user,
      birthDate,
      estimateLifeSpan
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "Failed to update user life span details. "
        )
      );
  }
});

const updateUserBasicInformationController = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName?.length) {
    return res.status(400).json(
      new ApiError(
        400,
        {
          error: "Missing fields, first name is required. ",
        },
        "Missing fields, first name is required. "
      )
    );
  }

  try {
    const response = await updateUserBasicInformationService(
      req?.user,
      firstName,
      lastName
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "Failed to update user basic information details. "
        )
      );
  }
});

const updateUserEmailInformationController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.length) {
    return res.status(400).json(
      new ApiError(
        400,
        {
          error: "Missing fields, email is required. ",
        },
        "Missing fields, email is required. "
      )
    );
  }

  try {
    const response = await updateUserEmailInformationService(email);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "Failed to update user email details. "
        )
      );
  }
});

const confirmOTPAndUpdateUserEmailInformationController = asyncHandler(
  async (req, res) => {
    const { email, otp } = req.body;
    const user = req?.user;

    if (!email?.length || !otp?.length) {
      return res.status(400).json(
        new ApiError(
          400,
          {
            error: "Missing fields, email and otp is required. ",
          },
          "Missing fields, email and otp is required. "
        )
      );
    }

    try {
      const response = await confirmOTPAndUpdateUserEmailInformationService(
        user,
        email,
        otp
      );
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "Failed to update user email details. "
          )
        );
    }
  }
);

export {
  activateWorkingFrameworkController,
  confirmOTPAndUpdateUserEmailInformationController,
  getUserDetailsController,
  updateUserBasicInformationController,
  updateUserDetailsController,
  updateUserEmailInformationController,
  updateUserLifeSpanController,
};
