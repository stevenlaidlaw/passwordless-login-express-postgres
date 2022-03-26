const home = require("./home.js");
const login = require("./login.js");
const register = require("./register.js");

module.exports = (app) => {
  app.use("/", home);
  app.use("/login", login);
  app.use("/register", register);
};
