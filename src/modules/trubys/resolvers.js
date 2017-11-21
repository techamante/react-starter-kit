export default pubsub => ({
  Query: {
    async curriculumById(obj, { id }, { Curriculum }, insp) {
      console.log(insp);
      const curriculum = await Curriculum.findById(id).populate('courses');
      return curriculum;
    },
  },
});
