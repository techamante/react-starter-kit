import React from 'react';
import { ModalRoute } from 'react-router-modal';
import Loadable from 'react-loadable';
import Feature from '../connector';
import { AuthRoute } from '../user/containers/Auth';

const VideoPlayer = Loadable({
  loader: () => import('./containers/VideoPlayer'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/VideoPlayer'],
  webpack: () => [require.resolveWeak('./containers/VideoPlayer')],
});

export default new Feature({
  modalRoute: [
    <ModalRoute
      exact
      path="/courses/:courseId/video/"
      component={VideoPlayer}
    />,
  ],
});
