const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
// const rateLimit = require("express-rate-limit");
const mountRoutes = require("./routes");
const session = require("./lib/session");

const { NODE_ENV, PORT } = process.env;

const isProd = NODE_ENV === "production";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middlewares
app.use(logger(isProd ? "common" : "dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: isProd ? "https://www.realaddress.com/" : "*",
  })
);
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(session);

// Routers
mountRoutes(app);

// No match to routes above. Throw 404 and pass down to error handler
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isProd ? {} : err;

  console.error(`Error: ${err.message}`);

  // render the error page
  res.status(err.status || 500);
  res.render("error", { error: err.message });
});

app.listen(PORT, () => {
  console.log(
    `Server running in '${isProd ? "prod" : "dev"}' mode on port ${PORT}`
  );
});
