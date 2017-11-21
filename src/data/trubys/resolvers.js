export default pubsub => ({
  Query: {
    async curriculumById(obj, { id }, context) {
      console.error(obj, id, context, pubsub);
    },
  },
});
