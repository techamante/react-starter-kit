import ReactDOM from 'react-dom';
import React from 'react';
import Loadable from 'react-loadable';
// Virtual module, see webpack-virtual-modules usage in webpack.run.js
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions import 'backend_reload';
import Main from './app/Main';
import log from '../common/log';

window.main = () => {
  const root = document.getElementById('content');

  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(<Main />, root);
  });

  let frontendReloadCount = 0;

  if (__DEV__) {
    if (module.hot) {
      module.hot.accept();

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
};
