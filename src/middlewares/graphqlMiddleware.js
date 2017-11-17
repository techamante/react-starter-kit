import { graphqlExpress } from "apollo-server-express";
import { invert, isArray } from "lodash";

import schema from "../data/schema";
import { log } from "../helpers";
import queryMap from "persisted_queries.json";
import { graphQL } from "../config";

export default graphqlExpress(async req => {
  try {
    return {
      schema,
      context: req
    };
  } catch (e) {
    log(e.stack);
  }
});

console.log(queryMap);

const invertedMap = invert(queryMap);
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
