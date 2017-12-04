import http from 'http';
import bluebird from 'bluebird';
import express from 'express';
import { graphiqlConnect } from 'apollo-server-express';
import mongoose from 'mongoose';
import passport from 'passport';

import { ensureLoggedIn } from 'connect-ensure-login';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import websiteMiddleware from './middlewares/website';

import config from '../../settings';
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

mongoose.connect(config.db.mongoURI);
// todo workaround for HMR. It remove old model before added new ones
Object.keys(mongoose.connection.models).forEach(key => {
  delete mongoose.connection.models[key];
});

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

app.get('/auth/login', passport.authenticate('oauth2'));

app.get(
  '/callback',
  passport.authenticate('oauth2', { failureRedirect: '/test' }),
  (req, res) => {
    res.redirect('/');
  },
);

//
// Auth Test URL
//--------------------------------------------------------------------------------
app.get('/test', (req, res) => {
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
  const server = app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
  addGraphQLSubscriptions(server);
}

function createSocket() {
  const server = http.createServer((req, res) => {
    res.writeHead(400);
    res.end();
  });

  server.listen(3002, () => {
    console.info(`Websocket server is running at http://localhost:3002/`);
  });

  return server;
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
let server;
if (module.hot) {
  app.hot = module.hot;
  server = createSocket();
  addGraphQLSubscriptions(server);

  module.hot.dispose(() => {
    try {
      if (server) {
        server.close();
      }
    } catch (error) {
      console.log(error.stack);
    }
  });

  module.hot.accept(['./graphql/subscriptions'], () => {
    try {
      server = createSocket();
      addGraphQLSubscriptions(server);
    } catch (error) {
      console.log(error.stack);
    }
  });

  module.hot.accept();
}

export default app;
