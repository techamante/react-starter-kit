
import path from "path";
import Promise from "bluebird";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressJwt, { UnauthorizedError as Jwt401Error } from "express-jwt";
import passport from "./passport";
import router from "./router";
import models from "./data/models";
import config from "./config";
import { graphqlMiddleware, errorHandler, renderer } from "./middlewares";
import {authRoutes} from './express/routes'

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || "all";

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token
  })
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error("[express-jwt-error]", req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie("id_token");
  }
  next(err);
});

app.use(passport.initialize());

if (__DEV__) {
  app.enable("trust proxy");
}
authRoutes(app);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use("/graphql", graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get("*", renderer);

//
// Error handling
// -----------------------------------------------------------------------------
app.use(errorHandler);

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept("./router");
}

export default app;
