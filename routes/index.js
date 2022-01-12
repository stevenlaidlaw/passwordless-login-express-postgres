const home = require("./home.js");
const users = require("./users.js");

module.exports = (app) => {
  app.use("/", home);
  app.use("/users", users);
};
