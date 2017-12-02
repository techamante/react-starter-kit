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
  createContextFunc: (req, connectionParams) => {
    let tokenUser = null;
    let auth = { isAuthenticated: false, scope: null };

    if (
      connectionParams &&
      connectionParams.token &&
      connectionParams.token !== 'null' &&
      connectionParams.token !== 'undefined'
    ) {
      // try {
      //   const { user } = jwt.verify(connectionParams.token, SECRET);
      //   tokenUser = user;
      // } catch (err) {
      //   const newTokens = await refreshTokens(
      //     connectionParams.token,
      //     connectionParams.refreshToken,
      //     User,
      //     SECRET,
      //   );
      //   tokenUser = newTokens.user;
      // }
    } else if (req) {
      if (req.user) {
        tokenUser = req.user;
      }
    }
    if (tokenUser) {
      auth = {
        isAuthenticated: true,
        scope: scopes[tokenUser.role],
      };
    }

    return {
      auth,
      User,
    };
  },
});
