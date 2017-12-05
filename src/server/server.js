import http from 'http';
import bluebird from 'bluebird';
import express from 'express';
import { graphiqlConnect } from 'apollo-server-express';
import passport from 'passport';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import websiteMiddleware from './middlewares/website';

import config from '../../settings';
import oauth from './oauth';
import './oauth/auth';
import mongooseConfig from './mongoose';
import addGraphQLSubscriptions from './graphql/subscriptions';

import {
  graphqlMiddleware,
  persistedQueriesMiddleware,
  createApolloEngineMiddleware,
} from './graphql';

import expressConfig from './express';

import { errorHandler } from './middlewares';

global.Promise = bluebird;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();
mongooseConfig(config);
//
// Setup Express Pipeline
// -----------------------------------------------------------------------------
app.use(createApolloEngineMiddleware());
expressConfig(app, config);

//
// Authentication
// -----------------------------------------------------------------------------
app.use('/', oauth);
app.get('/auth/login', passport.authenticate('oauth2'));

app.get(
  '/callback',
  passport.authenticate('oauth2', { failureRedirect: '/test' }),
  (req, res) => {
    res.redirect('/');
  },
);

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
  }),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.use((...args) => websiteMiddleware(queryMap)(...args));

// Error handling
//-----------------------------------------------------------------------------
app.use(errorHandler);

//
// Launch the server
// -----------------------------------------------------------------------------

if (!module.hot) {
  const server = app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
  addGraphQLSubscriptions(server);
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------

function startServer() {
  const httpServer = http.createServer().listen(3002, error => {
    if (error) {
      console.error(error);
    } else {
      addGraphQLSubscriptions(httpServer);
      const address = httpServer.address();
      console.info(
        `==> 🌎 Listening on ${address.port}. Open up http://localhost:${
          address.port
        }/ in your browser.`,
      );
    }
  });

  // Hot Module Replacement API
  if (module.hot) {
    // Hot reload of entry module (self). It will be restart http-server.
    module.hot.dispose(() => {
      console.log('Disposing entry module...');
      httpServer.close();
    });
  }
}

if (module.hot) {
  app.hot = module.hot;
  startServer();
}

export default app;
