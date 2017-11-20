import ApolloClient from 'apollo-client';

const createApolloClient = clientParams => {
  const params = { ...clientParams };
  if (__SSR__) {
    if (__CLIENT__) {
      if (window.App.apolloState) {
        params.initialState = window.App.apolloState;
      }
      params.ssrForceFetchDelay = 100;
    } else {
      params.ssrMode = true;
    }
  }
  return new ApolloClient(params);
};

export default createApolloClient;
