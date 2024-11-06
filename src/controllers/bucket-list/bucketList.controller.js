import {
  addItemToBucketListOfUserService,
  deleteParticularItemFromBucketListOfUserService,
  getBucketListItemsOfUserService,
  updateParticularItemFromBucketListOfUserService,
} from "../../services/bucketList/bucketListService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getBucketListItemsOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getBucketListItemsOfUserService(user);
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
          "something went wrong fetching get bucket list items of user"
        )
      );
  }
});

const addItemToBucketListOfUser = asyncHandler(async (req, res) => {
  const { bucketItem } = req.body;
  const user = req?.user;
  const { title, description, isCompleted } = bucketItem;

  if (
    !title?.length ||
    !description?.length ||
    typeof isCompleted !== "boolean"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addItemToBucketListOfUserService(user, bucketItem);
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
          "something went wrong adding item to bucket list"
        )
      );
  }
});

const updateParticularItemFromBucketListOfUser = asyncHandler(
  async (req, res) => {
    const { bucketItem, bucketId } = req.body;
    const user = req?.user;
    const { title, description, isCompleted } = bucketItem;

    if (
      !bucketId?.length ||
      !title?.length ||
      !description?.length ||
      typeof isCompleted !== "boolean"
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await updateParticularItemFromBucketListOfUserService(
        user,
        bucketItem,
        bucketId
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
            "something went wrong updating item to bucket list"
          )
        );
    }
  }
);

const deleteParticularItemFromBucketListOfUser = asyncHandler(
  async (req, res) => {
    const { bucketId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromBucketListOfUserService(
        user,
        bucketId
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
            "something went wrong updating item to bucket list"
          )
        );
    }
  }
);

export {
  addItemToBucketListOfUser,
  deleteParticularItemFromBucketListOfUser,
  getBucketListItemsOfUser,
  updateParticularItemFromBucketListOfUser,
};
