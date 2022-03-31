const Router = require("express-promise-router");
const { validationResult } = require("express-validator");
const { val_email, val_varchar_64 } = require("../lib/validators");
const queries = require("../db/queries");

const router = new Router();

router.get("/", async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  return res.render("user_forms", {
    title: "Register",
    register: true,
    logoDark: true,
    layout: "minimal",
    question: "Already a member?",
    button: "Login",
    link: "/login",
  });
});

router.post("/", [val_varchar_64("name"), val_email], async (req, res) => {
  const errors = validationResult(req);

  const { name, email } = req.body;

  if (!errors.isEmpty()) {
    return res.render("user_forms", {
      error: errors
        .array()
        .map(({ msg }) => msg)
        .join("<br/>"),
      name,
      email,
      title: "Register",
      register: true,
      logoDark: true,
      layout: "minimal",
      question: "Already a member?",
      button: "Login",
      link: "/login",
    });
  }

  const users = await queries.users.Get.ByNameOrEmail(name, email);

  if (users.length > 0) {
    return res.render("user_forms", {
      error:
        users[0].name === name
          ? "This name is unavailable"
          : "This email is already registered",
      name,
      email,
      title: "Register",
      register: true,
      logoDark: true,
      layout: "minimal",
      question: "Already a member?",
      button: "Login",
      link: "/login",
    });
  }

  await queries.users.Create(name, email);

  // Redirect to /login POST, which sends a login token
  return res.redirect(307, "/login");
});

module.exports = router;
