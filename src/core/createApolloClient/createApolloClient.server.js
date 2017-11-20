import 'isomorphic-fetch';
import { createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
//eslint-disable-next-line
import { InMemoryCache } from "apollo-cache-inmemory";
import url from 'url';
import { LoggingLink } from 'apollo-logger';
import createApolloClient from './createApolloClient.common';

import config from '../../config';

const { protocol, hostname, port, pathname } = url.parse(__BACKEND_URL__);
const apiUrl = `${protocol}//${hostname}:${process.env.PORT || port}${
  pathname
}`;

export default req => {
  const fetch = createApolloFetch({
    uri: apiUrl,
  });

  fetch.batchUse(({ options }, next) => {
    try {
      options.credentials = 'include'; // eslint-disable-line no-param-reassign
      options.headers = req.headers; // eslint-disable-line no-param-reassign
    } catch (e) {
      console.error(e);
    }

    next();
  });
  const cache = new InMemoryCache();

  const link = new BatchHttpLink({ fetch });

  const client = createApolloClient({
    link: ApolloLink.from(
      (config.logging ? [new LoggingLink()] : []).concat([link]),
    ),
    cache,
  });

  return client;
};
