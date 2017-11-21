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

import modules from '../../modules';
import { log } from '../../helpers';
import pubsub from './pubsub';
import RootSchema from './rootSchema.graphql';
import me from '../../modules/sample/me';
import news from '../../modules/sample/news';

const trubysSchema = makeExecutableSchema({
  typeDefs: [RootSchema, ...modules.schemas],
  resolvers: modules.createResolvers(pubsub),
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
