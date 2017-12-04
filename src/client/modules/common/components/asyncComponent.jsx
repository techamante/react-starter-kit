import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading</div>;

export default m => {
  console.log(m);
  return Loadable({ loader: m, loading: Loading });
};
