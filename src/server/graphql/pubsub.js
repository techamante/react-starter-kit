import { addApolloLogging } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';
import config from '../../config';

const pubsub = config.logging ? addApolloLogging(new PubSub()) : new PubSub();

export default pubsub;
