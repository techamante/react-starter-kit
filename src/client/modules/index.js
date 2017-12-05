import counter from './counter';
import user from './user';
import pageNotFound from './pageNotFound';
import './favicon';
import Feature from './connector';
import ui from './ui-bootstrap';
import curriculums from './curriculums';
import courses from './courses';
import videos from './videos';
import landing from './landing';

export default new Feature(
  landing,
  curriculums,
  courses,
  videos,
  user,
  pageNotFound,
  ui,
);
