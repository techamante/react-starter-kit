const COUNTER_SUBSCRIPTION = 'counter_subscription';

export default pubsub => ({
  Query: {
    counter(obj, args, context) {
      return { amount: 1 };
    },
  },
  Mutation: {
    async addCounter(obj, { amount }, context) {
      const counter = {
        amount: amount + 1,
      };

      pubsub.publish(COUNTER_SUBSCRIPTION, {
        counterUpdated: { amount: counter.amount },
      });

      return counter;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => pubsub.asyncIterator(COUNTER_SUBSCRIPTION),
    },
  },
});
