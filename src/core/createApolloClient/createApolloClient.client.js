import { createApolloFetch } from "apollo-fetch";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import url from "url";
import { LoggingLink } from "apollo-logger";
import createApolloClient from "./createApolloClient.common";

const backendUrl =`${__BACKEND_URL__}/graphql`;

const { hostname, pathname, port } = url.parse(backendUrl);

export default params => {
  const fetch = createApolloFetch({
    uri: hostname === "localhost" ? "/graphql" : backendUrl
  });
  fetch.batchUse(({ requests, options }, next) => {
    try {
      options.credentials = "same-origin";
      options.headers = options.headers || {};
    } catch (e) {
      console.error(e);
    }

    next();
  });
  const cache = new InMemoryCache();

  let link = new BatchHttpLink({ fetch });

  const client = createApolloClient({
    link: ApolloLink.from(
      (true? [new LoggingLink()] : []).concat([link])
    ),
    cache
  });
  debugger;
  if (window.App.apolloState) {

    cache.restore(window.App.apolloState);
  }

  return client;
};
