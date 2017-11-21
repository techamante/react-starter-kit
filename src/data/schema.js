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
  mergeSchemas,
  addErrorLoggingToSchema,
} from 'graphql-tools';

import { log, pubsub } from '../helpers';

import me from './sample/me';
import news from './sample/news';

import { SharedTypes } from './shared';
import RootSchema from './rootSchema.graphql';
import { TrubysSchema, TrubysTypes } from './trubys';
import { AuthSchema, AuthTypes, resolvers } from './auth';

const trubysSchema = makeExecutableSchema({
  typeDefs: [
    RootSchema,
    AuthSchema,
    TrubysSchema,
    SharedTypes,
    AuthTypes,
    TrubysTypes,
  ],
  resolvers: resolvers(pubsub),
});

addErrorLoggingToSchema(trubysSchema, { log: e => log.error(e) });
// addMockFunctionsToSchema({ schema: apolloSchema });
// addMockFunctionsToSchema({ schema: authSchema });
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
  schemas: [trubysSchema, schema],
});
