import {
  addItemToGratitudeListOfUserService,
  deleteParticularItemFromGratitudeListOfUserService,
  getGratitudeListItemsOfUserService,
  updateParticularItemFromGratitudeListOfUserService,
} from "../../services/gratitude/gratitudeService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getGratitudeListItemsOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getGratitudeListItemsOfUserService(user);
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
          "something went wrong fetching get gratitude list items of user"
        )
      );
  }
});

const addItemToGratitudeListOfUser = asyncHandler(async (req, res) => {
  const { gratitudeItem } = req.body;
  const user = req?.user;
  const { title, description } = gratitudeItem;

  if (!title?.length || !description?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addItemToGratitudeListOfUserService(
      user,
      gratitudeItem
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
          "something went wrong adding item to gratitude list"
        )
      );
  }
});

const updateParticularItemFromGratitudeListOfUser = asyncHandler(
  async (req, res) => {
    const { gratitudeItem, gratitudeId } = req.body;
    const user = req?.user;
    const { title, description } = gratitudeItem;

    if (!gratitudeId?.length || !title?.length || !description?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await updateParticularItemFromGratitudeListOfUserService(
        user,
        gratitudeItem,
        gratitudeId
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
            "something went wrong updating item to gratitude list"
          )
        );
    }
  }
);

const deleteParticularItemFromGratitudeListOfUser = asyncHandler(
  async (req, res) => {
    const { gratitudeId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromGratitudeListOfUserService(
        user,
        gratitudeId
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
            "something went wrong updating item to gratitude list"
          )
        );
    }
  }
);

export {
  addItemToGratitudeListOfUser,
  deleteParticularItemFromGratitudeListOfUser,
  getGratitudeListItemsOfUser,
  updateParticularItemFromGratitudeListOfUser,
};
