import styles from './styles/styles.scss';
import bootstrap from '../../../../node_modules/bootstrap/scss/bootstrap.scss';

import Feature from '../connector';

export default new Feature({
  stylesInsert: [styles, bootstrap],
});
