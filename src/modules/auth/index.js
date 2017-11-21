import Feature from '../connector';
import AuthSchema from './schema.graphql';
import AuthTypes from './types.graphql';
import resolvers from './resolvers';

export { default as seed } from './seed';

export default new Feature({
  schema: [AuthSchema, AuthTypes],
  createResolversFunc: resolvers,
});
