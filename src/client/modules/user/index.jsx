import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { Route, NavLink, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
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

const Profile = Loadable({
  loader: () => import('./containers/Profile'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/Profile'],
  webpack: () => [require.resolveWeak('./containers/Profile')],
});

const Users = Loadable({
  loader: () => import('./components/Users'),
  loading: () => <div>Loading</div>,
  modules: ['./components/Users'],
  webpack: () => [require.resolveWeak('./components/Users')],
});

const UserEdit = Loadable({
  loader: () => import('./containers/UserEdit'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/UserEdit'],
  webpack: () => [require.resolveWeak('./containers/UserEdit')],
});

const Register = Loadable({
  loader: () => import('./containers/Register'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/Register'],
  webpack: () => [require.resolveWeak('./containers/Register')],
});

const Login = Loadable({
  loader: () => import('./containers/Login'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/Login'],
  webpack: () => [require.resolveWeak('./containers/Login')],
});

const ForgotPassword = Loadable({
  loader: () => import('./containers/ForgotPassword'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/ForgotPassword'],
  webpack: () => [require.resolveWeak('./containers/ForgotPassword')],
});

const ResetPassword = Loadable({
  loader: () => import('./containers/ResetPassword'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/ResetPassword'],
  webpack: () => [require.resolveWeak('./containers/ResetPassword')],
});

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" scope="user" component={Profile} />,
    <AuthRoute exact path="/users" scope="admin" component={Users} />,
    <Route exact path="/users/:id" component={UserEdit} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />,
    <Route exact path="/forgot-password" component={ForgotPassword} />,
    <Route exact path="/reset-password/:token" component={ResetPassword} />,
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
