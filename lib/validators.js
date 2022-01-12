const { body, check } = require("express-validator");

const val_user_name = check("name")
  .isLength({ min: 3, max: 64 })
  .withMessage("Name must be between 3 and 64 characters in length")
  .trim();

const val_user_email = check("email")
  .isEmail()
  .withMessage("Email address must be valid")
  .normalizeEmail()
  .trim();

module.exports = {
  val_user_name,
  val_user_email,
};
