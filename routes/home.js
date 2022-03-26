const Router = require("express-promise-router");

const router = new Router();

router.get("/", async (req, res) => {
  return res.render(req.user ? "home_user" : "home_unauth", {
    user: req.user,
  });
});

module.exports = router;
