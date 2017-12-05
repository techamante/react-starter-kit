import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { LoggedInRoute } from '../user/containers/Auth';

import Feature from '../connector';

const Dashboard = Loadable({
  loader: () => import('./containers/Dashboard'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/Dashboard'],
  webpack: () => [require.resolveWeak('./containers/Dashboard')],
});

const PublicPage = Loadable({
  loader: () => import('./containers/PublicPage'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/PublicPage'],
  webpack: () => [require.resolveWeak('./containers/PublicPage')],
});

export default new Feature({
  route: (
    <LoggedInRoute exact path="/" component={Dashboard} else={PublicPage} />
  ),
});
