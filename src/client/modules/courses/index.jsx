import React from 'react';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import asyncComponent from '../common/components/asyncComponent';
import Feature from '../connector';

export default new Feature({
  route: [
    <Route
      exact
      path="/courses"
      component={asyncComponent(() =>
        import(/* webpackChunkName: 'courselist' */ './containers/CourseList'),
      )}
    />,
    <Route
      path="/courses/:id"
      component={asyncComponent(() => import('./containers/CourseDetail'))}
    />,
  ],
  navItem: (
    <MenuItem key="/courses">
      <NavLink to="/courses" className="nav-link" activeClassName="active">
        Courses
      </NavLink>
    </MenuItem>
  ),
});
