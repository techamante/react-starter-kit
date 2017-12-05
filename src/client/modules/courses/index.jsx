import React from 'react';
import Loadable from 'react-loadable';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Feature from '../connector';

const CourseList = Loadable({
  loader: () => import('./containers/CourseList'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/CourseList'],
  webpack: () => [require.resolveWeak('./containers/CourseList')],
});

const CourseDetail = Loadable({
  loader: () => import('./containers/CourseDetail'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/CourseDetail'],
  webpack: () => [require.resolveWeak('./containers/CourseDetail')],
});

export default new Feature({
  route: [
    <Route exact path="/courses" component={CourseList} />,
    <Route path="/courses/:id" component={CourseDetail} />,
  ],
  navItem: (
    <MenuItem key="/courses">
      <NavLink to="/courses" className="nav-link" activeClassName="active">
        Courses
      </NavLink>
    </MenuItem>
  ),
});
