import auth from './auth';
import shared from './shared';
import counter from './counter';
import posts from './posts';
import Feature from './connector';

export default new Feature(auth, shared, counter, posts);
