import {
  addItemToSelfReviewListOfUserService,
  deleteParticularItemFromSelfReviewListOfUserService,
  getSelfReviewListItemsOfUserService,
  updateParticularItemFromSelfReviewListOfUserService,
} from "../../services/selfReview/selfReviewService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getSelfReviewListItemsOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getSelfReviewListItemsOfUserService(user);
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
          "something went wrong fetching get self review list items of user"
        )
      );
  }
});

const addItemToSelfReviewListOfUser = asyncHandler(async (req, res) => {
  const { selfReviewItem } = req.body;
  const user = req?.user;
  const { title, description, date } = selfReviewItem;

  if (!title?.length || !description?.length || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addItemToSelfReviewListOfUserService(
      user,
      selfReviewItem
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
          "something went wrong adding item to self review list"
        )
      );
  }
});

const updateParticularItemFromSelfReviewListOfUser = asyncHandler(
  async (req, res) => {
    const { selfReviewItem, selfReviewItemId } = req.body;
    const user = req?.user;
    const { title, description, date } = selfReviewItem;

    if (!title?.length || !description?.length || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response =
        await updateParticularItemFromSelfReviewListOfUserService(
          user,
          selfReviewItem,
          selfReviewItemId
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
            "something went wrong updating item to self review list"
          )
        );
    }
  }
);

const deleteParticularItemFromSelfReviewListOfUser = asyncHandler(
  async (req, res) => {
    const { selfReviewItemId } = req.query;
    const user = req?.user;

    try {
      const response =
        await deleteParticularItemFromSelfReviewListOfUserService(
          user,
          selfReviewItemId
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
            "something went wrong deleting item to self review list"
          )
        );
    }
  }
);

export {
  addItemToSelfReviewListOfUser,
  deleteParticularItemFromSelfReviewListOfUser,
  getSelfReviewListItemsOfUser,
  updateParticularItemFromSelfReviewListOfUser,
};
