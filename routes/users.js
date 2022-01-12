const Router = require("express-promise-router");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../lib/email");
const { val_user_email, val_user_name } = require("../lib/validators");
const { makeToken } = require("../lib/auth");
const Queries = require("../db/queries");

const router = new Router();

router.get("/logout", async (req, res) => {
  req.session.info = "Successfully logged out";
  return res.clearCookie("access_token").status(200).redirect("/users/login");
});

router.get("/login", async (req, res) => {
  const { info, error } = req.session;
  if (req.user) {
    return res.redirect("/");
  }

  return res.render("login", { info, error });
});

router.post("/login", [val_user_email], async (req, res) => {
  const errors = validationResult(req);

  const { email } = req.body;

  if (!errors.isEmpty()) {
    return res.render("login", {
      error: errors
        .array()
        .map(({ msg }) => msg)
        .join("<br/>"),
      email,
    });
  }

  const users = await Queries.Users.Get.ByEmail(email);

  if (users.length === 0) throw { message: "No user found" };

  const user = users[0];

  // Generate OTP
  const code = Math.random().toString(32).slice(2, 8).toUpperCase();
  const encrypted_code = bcrypt.hashSync(code, 10);

  // Delete any existing OTPs and insert this new one
  await Queries.Otp.Delete.ById(user.id);
  await Queries.Otp.Create(user.id, encrypted_code);

  // Send Email
  await sendEmail(email, "Login Code", `Your login code is ${code}`);

  return res.render("token", {
    email,
  });
});

router.post("/token", async (req, res) => {
  const { email, code } = req.body;

  const users = await Queries.Users.Get.ByEmail(email);

  if (users.length === 0)
    throw { message: "No user detected. Please login again." };

  const user = users[0];

  const otps = await Queries.Otp.Get.ByUserId(user.id);

  if (otps.length === 0)
    throw { message: "Login code has expired. Please request a new one." };

  const otp = otps[0];

  // Verify the code isn't too old
  if (Date.parse(otp.created_at) + 1000 * 60 * 15 < Date.now())
    throw { message: "Login code has expired. Please request a new one." };

  // Verify the code matches
  const match = bcrypt.compareSync(code, otp.code);

  if (!match) throw { message: "Error with code" };

  // Delete code
  await Queries.Otp.Delete.ByUserId(user.id);

  const token = makeToken({
    ...user,
  });

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .redirect("/");
});

router.get("/register", async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  return res.render("register");
});

router.post("/register", [val_user_name, val_user_email], async (req, res) => {
  const errors = validationResult(req);

  const { name, email } = req.body;

  if (!errors.isEmpty()) {
    return res.render("register", {
      error: errors
        .array()
        .map(({ msg }) => msg)
        .join("<br/>"),
      name,
      email,
    });
  }

  const users = await Queries.Users.Get.ByNameOrEmail(name, email);

  if (users.length > 0) {
    return res.render("register", {
      error:
        users[0].name === name
          ? "This name is unavailable"
          : "This email is already registered",
      name,
      email,
    });
  }

  await Queries.Users.Create(name, email);

  // Redirect to /login POST, which sends a login token
  return res.redirect(307, "/users/login");
});

module.exports = router;
