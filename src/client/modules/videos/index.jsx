import React from 'react';
import { ModalRoute } from 'react-router-modal';
import asyncComponent from '../common/components/asyncComponent';
import Feature from '../connector';
import { AuthRoute } from '../user/containers/Auth';

export default new Feature({
  modalRoute: [
    <ModalRoute
      exact
      path="/courses/:courseId/video/"
      component={asyncComponent(() => import('./containers/VideoPlayer'))}
    />,
  ],
});
