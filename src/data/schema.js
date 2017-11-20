/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas,
  addErrorLoggingToSchema,
} from 'graphql-tools';

import { log, pubsub } from '../helpers';

import me from './queries/me';
import news from './queries/news';
import CourseType from './types/CourseType.graphql';
import CourseTypeResolvers from './types/CourseType';

const apolloSchema = makeExecutableSchema({
  typeDefs: CourseType,
  resolvers: CourseTypeResolvers(pubsub),
});

addErrorLoggingToSchema(apolloSchema, { log: e => log.error(e) });
addMockFunctionsToSchema({ schema: apolloSchema });

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
    },
  }),
});

export default mergeSchemas({
  schemas: [apolloSchema, schema],
});
