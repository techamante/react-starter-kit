// @flow

import { PubSub } from '../../helpers';

export default (pubsub: PubSub) => ({
  Query: {
    async userById(obj, { id }, context) {
      console.error(obj, id, context, pubsub);
    },
  },
});
