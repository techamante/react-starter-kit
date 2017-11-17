import { graphqlExpress } from "apollo-server-express";
import schema from "../data/schema";
import { log } from "../helpers";

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
