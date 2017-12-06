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

// let httpServer;

// if (module.hot) {
//   app.hot = module.hot;
//   httpServer = http.createServer().listen(3002);
//   addGraphQLSubscriptions(httpServer);

//   module.hot.dispose(() => {
//     try {
//       if (httpServer) {
//         httpServer.close();
//       }
//     } catch (error) {
//       log(error.stack);
//     }
//   });
//   module.hot.accept(['./middlewares/website', './graphql/graphqlMiddleware']);
//   module.hot.accept(['./graphql/subscriptions'], () => {
//     try {
//       addGraphQLSubscriptions(server);
//     } catch (error) {
//       log(error.stack);
//     }
//   });

//   module.hot.accept();
// }

if (module.hot) {
  app.hot = module.hot;
  const httpServer = http.createServer().listen(3002);
  addGraphQLSubscriptions(httpServer);
  app.subscriptionServer = httpServer;
}

export default app;
