import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '../common/components/asyncComponent';
import { LoggedInRoute } from '../user/containers/Auth';

import Feature from '../connector';

export default new Feature({
  route: (
    <LoggedInRoute
      exact
      path="/"
      component={asyncComponent(() => import('./containers/Dashboard'))}
      else={asyncComponent(() => import('./containers/PublicPage'))}
    />
  ),
});
