import http from 'http';
import bluebird from 'bluebird';
import path from 'path';
import express from 'express';
import { graphiqlConnect } from 'apollo-server-express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';

import { ensureLoggedIn } from 'connect-ensure-login';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import websiteMiddleware from './middlewares/website';

import config from '../config';
import oauth from './oauth';
import './oauth/auth';

import addGraphQLSubscriptions from './graphql/subscriptions';

import {
  graphqlMiddleware,
  persistedQueriesMiddleware,
  createApolloEngineMiddleware,
} from './graphql';

import expressConfig from './express';

// import { errorHandler } from './middlewares';

global.Promise = bluebird;

dotenv.load();
mongoose.connect(config.mongoURI);

const app = express();

const server = http.createServer((req, res) => {
  res.writeHead(400);
  res.end();
});

server.listen(3002, () => {
  console.info(`Websocket server is running at http://localhost:3002/`);
});

addGraphQLSubscriptions(server);

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
expressConfig(app, config);

//
// Authentication
// -----------------------------------------------------------------------------

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
    subscriptionEndPoint: `ws://localhost:3002/graphql`,
    query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}',
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
app.use((...args) => websiteMiddleware(queryMap)(...args));

//
// Error handling
// -----------------------------------------------------------------------------
// app.use(errorHandler);

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
  // module.hot.accept('../client/router');
}

export default app;
