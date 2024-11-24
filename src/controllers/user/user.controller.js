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
  const userId = req?.user?._id;

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
          "something went wrong while getting user details!"
        )
      );
  }
});

const updateUserDetailsController = asyncHandler(async (req, res) => {
  const { isGreetingModalShown } = req.body;
  const userId = req?.user?._id;

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

const reportBugController = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: description,
        }),
      }
    );
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to create issue on GitHub" });
    }

    const issue = await response.json();
    res.status(200).json({
      message: "Bug reported successfully",
      issueURL: issue.html_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export {
  activateWorkingFrameworkController,
  confirmOTPAndUpdateUserEmailInformationController,
  getUserDetailsController,
  reportBugController,
  updateUserBasicInformationController,
  updateUserDetailsController,
  updateUserEmailInformationController,
  updateUserLifeSpanController,
};
