import { graphqlExpress } from 'apollo-server-express';
// import { invert } from 'lodash';

import schema from '../graphql/schema';
import { log } from '../helpers';
// import queryMap from 'persisted_queries.json';
// import { graphQL } from '../config';
import modules from '../modules';

export default graphqlExpress(async req => {
  try {
    const ctx = await modules.createContext(req);
    return {
      schema,
      context: {
        req,
        ...ctx,
      },
      tracing: true,
      cacheControl: true,
    };
  } catch (e) {
    log(e.stack);
    return null;
  }
});

export const persistedQueriesMiddleware = (req, resp, next) => {
  next();

  // if (isArray(req.body)) {
  //   req.body = req.body.map(body => {
  //     return {
  //       query: invertedMap[body.id],
  //       ...body
  //     };
  //   });
  //   next();
  // } else {
  //   if (!__DEV__ || (req.get('Referer') || '').indexOf('/graphiql') < 0) {
  //     resp.status(500).send('Unknown GraphQL query has been received, rejecting...');
  //   } else {
  //     next();
  //   }
  // }
};
