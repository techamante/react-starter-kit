import React from 'react';
import Loadable from 'react-loadable';
import { PageLayout } from './web';

const Loading = () => <PageLayout>Loading</PageLayout>;

export default m => Loadable({ loader: m, loading: Loading });
