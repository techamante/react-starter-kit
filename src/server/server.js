import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlConnect } from 'apollo-server-express';
import mongoose from 'mongoose';
import cookiesMiddleware from 'universal-cookie-express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import config from '../config';
import {
  graphqlMiddleware,
  persistedQueriesMiddleware,
  createApolloEngineMiddleware,
} from './graphql';

import { errorHandler, renderer } from './middlewares';
// import authRoutes from './routes/authRoutes';
import SuperLogin from './modules/auth/services';

mongoose.connect(config.mongoURI);

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Setup Express Pipeline
// -----------------------------------------------------------------------------
app.use(createApolloEngineMiddleware());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookiesMiddleware());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(passport.initialize());
const superLogin = SuperLogin();
superLogin.registerOAuth2('google', GoogleStrategy);
superLogin.registerOAuth2('facebook', FacebookStrategy);
app.use('/auth', superLogin.router);

if (__DEV__) {
  app.enable('trust proxy');
}

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  superLogin.authenticate,
  persistedQueriesMiddleware,
  graphqlMiddleware,
);

app.use(
  '/graphiql',
  graphiqlConnect({
    endpointURL: '/graphql',
  }),
);

//
// Auth Test URL
//--------------------------------------------------------------------------------
app.get('/test', superLogin.authenticate, (req, res) => {
  res.json(req.user);
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', renderer);

//
// Error handling
// -----------------------------------------------------------------------------
app.use(errorHandler);

//
// Launch the server
// -----------------------------------------------------------------------------

if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('../client/router');
}

export default app;
