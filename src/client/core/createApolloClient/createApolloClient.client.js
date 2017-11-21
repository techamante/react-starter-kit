import { createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
//eslint-disable-next-line
import { InMemoryCache } from "apollo-cache-inmemory";
import url from 'url';
import { LoggingLink } from 'apollo-logger';
import createApolloClient from './createApolloClient.common';

const backendUrl = `${__BACKEND_URL__}/graphql`;

const { hostname } = url.parse(backendUrl);

export default () => {
  const fetch = createApolloFetch({
    uri: hostname === 'localhost' ? '/graphql' : backendUrl,
  });
  fetch.batchUse(({ options }, next) => {
    try {
      options.credentials = 'same-origin'; // eslint-disable-line no-param-reassign
      options.headers = options.headers || {}; // eslint-disable-line no-param-reassign
    } catch (e) {
      console.error(e);
    }

    next();
  });
  const cache = new InMemoryCache();

  const link = new BatchHttpLink({ fetch });

  const client = createApolloClient({
    link: ApolloLink.from((true ? [new LoggingLink()] : []).concat([link])),
    cache,
  });

  if (window.App.apolloState) {
    cache.restore(window.App.apolloState);
  }

  return client;
};
