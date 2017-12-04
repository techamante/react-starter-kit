import counter from './counter';
import user from './user';
import pageNotFound from './pageNotFound';
import './favicon';
import ui from './ui-bootstrap';

import Feature from './connector';

export default new Feature(counter, user, pageNotFound, ui);
