const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "email name image places");
    res.status(200).json(users.map((user) => user.toObject({ getters: true })));
  } catch (error) {
    return next(
      new HttpError("Could not retrieve users, please try again.", 500)
    );
  }
};

const signUp = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(
      new HttpError("Invalid user inputs, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser, createdUser;
  try {
    existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      return next(
        new HttpError("User already exists, please log in instead.", 422)
      );
    } else {
      let hashedPassword = await bcrypt.hash(password, 12);

      createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: [],
      });
      await createdUser.save();

      let token;
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      );

      res
        .status(201)
        .json({ userId: createdUser.id, email: createdUser.email, token });
    }
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not create user.", 500)
    );
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!user || !isValidPassword) {
      return next(
        new HttpError("Incorrect email and password combination.", 401)
      );
    }

    let token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ userId: user.id, email: user.email, token });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, coudl not login user, please try again.",
        500
      )
    );
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
};
