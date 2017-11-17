import expressGraphQL from 'express-graphql';
import schema from '../data/schema';



export default expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  }));