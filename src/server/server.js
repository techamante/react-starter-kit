import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlConnect } from 'apollo-server-express';
import mongoose from 'mongoose';
import cookiesMiddleware from 'universal-cookie-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import { ensureLoggedIn } from 'connect-ensure-login';

import config from '../config';
import oauth from './oauth';
import './oauth/auth';

import {
  graphqlMiddleware,
  persistedQueriesMiddleware,
  createApolloEngineMiddleware,
} from './graphql';

import { errorHandler, renderer } from './middlewares';

dotenv.load();
mongoose.connect(config.mongoURI);

const app = express();
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
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
app.use(cookieParser());
app.use(cookiesMiddleware());
app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true,
    key: 'authorization.sid',
  }),
);

//
// Authentication
// -----------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

app.use('/', oauth);

if (__DEV__) {
  app.enable('trust proxy');
}

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', persistedQueriesMiddleware, graphqlMiddleware);

app.use(
  '/graphiql',
  graphiqlConnect({
    endpointURL: '/graphql',
  }),
);

//
// Auth Test URL
//--------------------------------------------------------------------------------
app.get('/test', ensureLoggedIn(), (req, res) => {
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
