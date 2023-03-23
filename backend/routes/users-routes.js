const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

const usersControllers = require("../controllers/users-controllers");

router.get("/", usersControllers.getAllUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.signUp
);
router.post("/login", usersControllers.login);

module.exports = router;
