const jwt = require("jsonwebtoken");

const authBlock = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    req.session.error = "Error: No user token detected";
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!data.expirationDate || Date.parse(data.expirationDate) < Date.now()) {
      req.session.error = "Error: User session has expired";
      return res.redirect("/login");
    }
    req.user = {};
    Object.keys(data).forEach((key) => {
      req.user[key] = data[key];
    });
    return next();
  } catch {
    req.session.error = "Error: User token is invalid";
    return res.redirect("/login");
  }
};

const authAllow = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!data.expirationDate || Date.parse(data.expirationDate) < Date.now()) {
      return next();
    }
    req.user = {};
    Object.keys(data).forEach((key) => {
      req.user[key] = data[key];
    });
    return next();
  } catch {
    return next();
  }
};

const makeToken = (data) => {
  const expirationDate = new Date();
  expirationDate.setMonth(new Date().getMonth() + 1);
  return jwt.sign({ ...data, expirationDate }, process.env.JWT_SECRET_KEY);
};

module.exports = {
  authBlock,
  authAllow,
  makeToken,
};
