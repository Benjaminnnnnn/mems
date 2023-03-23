const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid;

  let places;
  try {
    places = await Place.findById(placeId).exec();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }

  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }

  res.json(places.toObject({ getters: true }));
};

const getUserPlacesById = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId }).exec();
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, could not find places for the user.",
        500
      )
    );
  }

  if (!places) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json(places.map((place) => place.toObject({ getters: true })));
};

const createPlace = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(
      new HttpError("Invalid user inputs, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body;

  // use geocoding api to convert address to coordinates
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    creator: req.userData.userId,
    location: coordinates,
    image: req.file.path,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId).exec();

    if (!user) {
      return next(new HttpError("Could not find the user id.", 404));
    } else {
      const session = await mongoose.startSession();
      session.startTransaction();
      await createdPlace.save({ session: session });
      user.places.push(createdPlace);
      await user.save({ session: session });
      await session.commitTransaction();
      await session.endSession();

      res.status(201).json(createdPlace);
    }
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not create a place, please try again.", 500)
    );
  }
};

const updatePlace = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result);
    return next(
      new HttpError("Invalid user inputs, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId).exec();

    // using jwt to ensure the current place belongs to the user
    if (place.creator.toString() !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to edit this place.", 403)
      );
    }

    place.title = title;
    place.description = description;
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Something wnet wrong, could not update place.", 500)
    );
  }

  res.status(200).json(place.toObject({ getters: true }));
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator").exec();

    if (place.creator.id !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to delete this place", 403)
      );
    }

    const imagePath = place.image;

    if (!place) {
      return next(new HttpError("Could not find the place for this id.", 404));
    } else {
      const session = await mongoose.startSession();
      session.startTransaction();
      await place.remove({ session: session });
      place.creator.places.pull(place);
      await place.creator.save({ session: session });
      await session.commitTransaction();
      await session.endSession();

      fs.unlink(imagePath, (err) => {
        console.log(err);
      });

      res.status(200).json({ messgae: "Deleted place" });
    }
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500)
    );
  }
};

module.exports = {
  getPlacesById,
  getUserPlacesById,
  createPlace,
  updatePlace,
  deletePlace,
};
