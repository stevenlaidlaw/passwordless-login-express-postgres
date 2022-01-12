const session = (req, res, next) => {
  req.session = req.session || {};
  return next();
};

module.exports = session;
