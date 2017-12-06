import counter from './counter';
import user from './user';
import pageNotFound from './pageNotFound';
import './favicon';
import Feature from './connector';
import ui from './ui-bootstrap';
import landing from './landing';
import post from './post';

export default new Feature(landing, post, user, pageNotFound, ui);
