import mongooseLib from 'mongoose';
import Curriculums from './seeders/curriculums.seeder';
import Courses from './seeders/courses.seeder';

mongooseLib.Promise = global.Promise;

// Export the mongoose lib
export const mongoose = mongooseLib;

// Export the mongodb url
export const mongoURL =
  'mongodb://anujmalla:password@ds259305.mlab.com:59305/pq-emaily-dev';

export const seedersList = {
  Curriculums,
  Courses,
};
