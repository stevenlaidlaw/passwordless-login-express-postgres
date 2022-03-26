const Router = require("express-promise-router");
const { users } = require("../db/queries");
const { authBlock } = require("../lib/auth");

const router = new Router();

router.get("/", authBlock, async (req, res) => {
  return res.render("account", { user: req.user, title: "Account Details" });
});

router.get("/delete", authBlock, async (req, res) => {
  return res.render("account_delete", {
    user: req.user,
    title: "Delete Account",
  });
});

router.post("/delete", authBlock, async (req, res) => {
  const { confirmation } = req.body;

  if (confirmation !== "I AGREE") {
    return res.render("account_delete", {
      error: "Incorrect confirmation code detected",
      user: req.user,
      title: "Delete Account",
    });
  }

  await users.Delete.ById(req.user.id);

  return res.clearCookie("access_token").status(200).redirect("/");
});

module.exports = router;
