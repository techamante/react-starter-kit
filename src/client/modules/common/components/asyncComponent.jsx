import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading</div>;

export default (m, i) =>
  Loadable({
    loader: m,
    loading: () => <div>Loading</div>,
    modules: [i],
    webpack: () => [require.resolveWeak(i)],
  });
