import Feature from '../connector';
import TrubysSchema from './schema.graphql';
import TrubysTypes from './types.graphql';
import resolvers from './resolvers';
import { Curriculum, Course } from './models';

export default new Feature({
  schema: [TrubysSchema, TrubysTypes],
  createResolversFunc: resolvers,
  createContextFunc: () => ({
    Curriculum,
    Course,
  }),
});