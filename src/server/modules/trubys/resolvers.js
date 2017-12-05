export default () => ({
  Query: {
    async curriculumById(obj, { id }, { CurriculumRepo }) {
      const curriculum = await CurriculumRepo.findByIdWithCourses(id);
      return curriculum;
    },
  },
  Mutation: {
    async addCourse(obj, { curriculumId, courseId }, { Curriculum, Course }) {
      const curriculum = await Curriculum.findByIdWithCourses(curriculumId);
      const course = await Course.findById(courseId);
      await curriculum.addCourse(course);
      return curriculum;
    },
  },
});
