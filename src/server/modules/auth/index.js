import _ from 'lodash';
import Feature from '../connector';
import AuthSchema from './schema.graphql';
import AuthTypes from './types.graphql';
import resolvers from './resolvers';
import User from './models/User';
import scopes from './scopes';

export { default as seed } from './seed';
export { User };

export default new Feature({
  schema: [AuthSchema, AuthTypes],
  createResolversFunc: resolvers,
  createContextFunc: ({ user }) => ({
    auth: {
      user,
      isAuthenticated: !_.isUndefined(user),
      scope: user && scopes[user.get('role')],
    },
    User,
  }),
});
