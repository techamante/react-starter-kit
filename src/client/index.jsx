import ReactDOM from 'react-dom';
import React from 'react';

// Virtual module, see webpack-virtual-modules usage in webpack.run.js
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions import 'backend_reload';

import Main from './app/Main';
import log from '../common/log';

const root = document.getElementById('content');

ReactDOM.render(<Main />, root);

let frontendReloadCount = 0;
// AppRegistry.runApplication('App', {
//   initialProps: { key: frontendReloadCount },
//   rootTag: root
// });

if (__DEV__) {
  if (module.hot) {
    module.hot.accept();

    // module.hot.accept('backend_reload', () => {
    //   log.debug('Reloading front-end');
    //   window.location.reload();
    // });

    module.hot.accept('./app/Main', () => {
      try {
        log.debug('Updating front-end');
        frontendReloadCount = (frontendReloadCount || 0) + 1;

        ReactDOM.render(<Main />, root);
      } catch (err) {
        log(err.stack);
      }
    });
  }
}
