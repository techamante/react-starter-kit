import auth from './auth';
import shared from './shared';
import trubys from './trubys';
import counter from './counter';
import Feature from './connector';

export default new Feature(auth, shared, trubys, counter);
