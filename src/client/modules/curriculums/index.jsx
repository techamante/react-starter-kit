import React from 'react';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import asyncComponent from '../common/components/asyncComponent';
import Feature from '../connector';

export default new Feature({
  route: [
    <Route
      exact
      path="/curriculums"
      component={asyncComponent(() => import('./containers/CurriculumList'))}
    />,
    <Route
      exact
      path="/curriculums/:id"
      component={asyncComponent(() => import('./containers/CurriculumDetail'))}
    />,
  ],
  navItem: (
    <MenuItem key="/curriculums">
      <NavLink to="/curriculums" className="nav-link" activeClassName="active">
        Curriculums
      </NavLink>
    </MenuItem>
  ),
});
