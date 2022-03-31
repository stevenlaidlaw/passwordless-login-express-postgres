const Router = require("express-promise-router");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../lib/email");
const { val_email } = require("../lib/validators");
const { makeToken } = require("../lib/auth");
const queries = require("../db/queries");

const siteName = "SiteName";

const router = new Router();

router.get("/", async (req, res) => {
  const { info, error } = req.session;
  if (req.user) {
    return res.redirect("/");
  }

  return res.render("user_forms", {
    info,
    error,
    title: "Login",
    login: true,
    logoDark: true,
    layout: "minimal",
    question: "Not a member?",
    button: "Register",
    link: "/register",
  });
});

router.post("/", [val_email], async (req, res) => {
  const errors = validationResult(req);

  const { email } = req.body;

  if (!errors.isEmpty()) {
    return res.render("user_forms", {
      error: errors
        .array()
        .map(({ msg }) => msg)
        .join("<br/>"),
      title: "Login",
      login: true,
      logoDark: true,
      layout: "minimal",
      question: "Not a member?",
      button: "Register",
      link: "/register",
    });
  }

  const users = await queries.users.Get.ByEmail(email);

  if (users.length === 0) throw { message: "No user found" };

  const user = users[0];

  // Generate OTP
  const code = crypto
    .randomBytes(256)
    .toString("hex")
    .slice(0, 6)
    .toUpperCase();
  const encrypted_code = bcrypt.hashSync(code, 10);

  // Delete any existing OTPs and insert this new one
  await queries.otps.Delete.ByUserId(user.id);
  await queries.otps.Create(user.id, encrypted_code);

  // Send Email
  await sendEmail(
    email,
    `${siteName} Login Code`,
    `
      <div style="padding:1em;max-width: 400px;">
        <h1>${siteName}</h1>
        <p>Hi ${user.name},</p>
        <p>Your login code for ${siteName} is <span style="font-weight:bold">${code}</span>.</p>
        <p style="opacity:0.5;font-style:italic;margin-top:3em;font-size:0.8em;">If you did not request this email you can safely ignore it.</p>
      </div>
    `
  );

  return res.render("user_forms", {
    info: "Check your email for a token to login",
    title: "Code",
    token: true,
    logoDark: true,
    layout: "minimal",
    question: "Didn't get a token?",
    button: "Try again",
    link: "/login",
    email,
  });
});

router.get("/logout", async (req, res) => {
  req.session.info = "Successfully logged out";
  return res.clearCookie("access_token").status(200).redirect("/");
});

router.post("/token", async (req, res) => {
  const { email, code } = req.body;

  const users = await queries.users.Get.ByEmail(email);

  if (users.length === 0)
    throw { message: "No user detected. Please login again." };

  const user = users[0];

  const otps = await queries.otps.Get.ByUserId(user.id);

  if (otps.length === 0)
    throw { message: "Login code has expired. Please request a new one." };

  const otp = otps[0];

  // Verify the code isn't too old
  if (Date.parse(otp.created_at) + 1000 * 60 * 15 < Date.now())
    throw { message: "Login code has expired. Please request a new one." };

  // Verify the code matches
  const match = bcrypt.compareSync(code.toUpperCase(), otp.code);

  if (!match) throw { message: "Error with code" };

  // Delete code
  await queries.otps.Delete.ByUserId(user.id);

  const token = makeToken({
    ...user,
  });

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "dev",
    })
    .status(200)
    .redirect("/");
});

module.exports = router;
