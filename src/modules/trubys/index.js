import './models';

import Feature from '../connector';
import TrubysSchema from './schema.graphql';
import TrubysTypes from './types.graphql';
import resolvers from './resolvers';

export default new Feature({
  schema: [TrubysSchema, TrubysTypes],
  createResolversFunc: resolvers,
});
