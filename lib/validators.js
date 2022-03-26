const { body, check, validationResult } = require("express-validator");

const val_email = check("email")
  .isEmail()
  .withMessage("Email address must be valid")
  .normalizeEmail()
  .trim();

const val_varchar_64 = (name) =>
  check(name)
    .isLength({ min: 1, max: 64 })
    .withMessage(`${name} must be between 1 and 64 characters in length`)
    .trim();

const val_varchar_256 = (name) =>
  check(name)
    .isLength({ min: 1, max: 256 })
    .withMessage(`${name} must be between 1 and 256 characters in length`)
    .trim();

module.exports = {
  val_email,
  val_varchar_64,
  val_varchar_256,
};
