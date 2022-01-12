const Router = require("express-promise-router");
const { auth } = require("../lib/auth");

const router = new Router();

router.get("/", auth, async (req, res) => {
  return res.render("index", {
    name: req.user.name,
  });
});

module.exports = router;
