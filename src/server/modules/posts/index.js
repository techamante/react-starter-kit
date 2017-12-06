import DataLoader from 'dataloader';

import createResolvers from './resolvers';
import PostSchema from './schema.graphql';
import PostTypes from './types.graphql';
import { Post, Comment } from './models';
import PostRepo from './repositories/PostRepo';
import Feature from '../connector';

export default new Feature({
  schema: [PostSchema, PostTypes],
  createResolversFunc: createResolvers,
  createContextFunc: () => ({
    Post,
    Comment,
    PostRepo,
  }),
});
