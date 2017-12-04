import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { Route, NavLink } from 'react-router-dom';
import asyncComponent from '../common/components/asyncComponent';
import { MenuItem } from '../../modules/common/components/web';
import reducers from './reducers';

import { AuthRoute, AuthNav, AuthLogin, AuthProfile } from './containers/Auth';

import Feature from '../connector';

function tokenMiddleware(req, options, next) {
  options.headers['x-token'] = window.localStorage.getItem('token');
  options.headers['x-refresh-token'] = window.localStorage.getItem(
    'refreshToken',
  );
  next();
}

function tokenAfterware(res, options, next) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
  next();
}

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken'),
  };
}

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/profile"
      scope="user"
      component={asyncComponent(() => import('./containers/Profile'))}
    />,
    <AuthRoute
      exact
      path="/users"
      scope="admin"
      component={asyncComponent(() => import('./components/Users'))}
    />,
    <Route
      exact
      path="/users/:id"
      component={asyncComponent(() => import('./containers/UserEdit'))}
    />,
    <Route
      exact
      path="/register"
      component={asyncComponent(() => import('./containers/Register'))}
    />,
    <Route
      exact
      path="/login"
      component={asyncComponent(() => import('./containers/Login'))}
    />,
    <Route
      exact
      path="/forgot-password"
      component={asyncComponent(() => import('./containers/ForgotPassword'))}
    />,
    <Route
      exact
      path="/reset-password/:token"
      component={asyncComponent(() => import('./containers/ResetPassword'))}
    />,
  ],
  navItem: [
    <MenuItem key="/users">
      <AuthNav scope="admin">
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </AuthNav>
    </MenuItem>,
  ],
  navItemRight: [
    <MenuItem key="/profile">
      <AuthProfile />
    </MenuItem>,
    <MenuItem key="login">
      <AuthLogin>
        <span className="nav-link">
          <a href="/auth/login">Sign In</a>
        </span>
      </AuthLogin>
    </MenuItem>,
  ],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => (
    <CookiesProvider cookies={req ? req.universalCookies : undefined} />
  ),
});
