import React from 'react';
import Loadable from 'react-loadable';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Feature from '../connector';

const CurriculumList = Loadable({
  loader: () => import('./containers/CurriculumList'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/CurriculumList'],
  webpack: () => [require.resolveWeak('./containers/CurriculumList')],
});

const CurriculumDetail = Loadable({
  loader: () => import('./containers/CurriculumDetail'),
  loading: () => <div>Loading</div>,
  modules: ['./containers/CurriculumDetail'],
  webpack: () => [require.resolveWeak('./containers/CurriculumDetail')],
});

export default new Feature({
  route: [
    <Route exact path="/curriculums" component={CurriculumList} />,
    <Route exact path="/curriculums/:id" component={CurriculumDetail} />,
  ],
  navItem: (
    <MenuItem key="/curriculums">
      <NavLink to="/curriculums" className="nav-link" activeClassName="active">
        Curriculums
      </NavLink>
    </MenuItem>
  ),
});
