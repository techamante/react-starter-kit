import { Engine } from 'apollo-engine';
import url from 'url';
import config from '../../config';

export default () => {
  let engine;
  if (config.analytics.apolloEngine.key) {
    const { protocol, hostname, port, pathname } = url.parse(__BACKEND_URL__);
    const apiUrl = `${protocol}//${hostname}:${process.env.PORT || port}${
      pathname
    }`;
    const serverPort = process.env.PORT || port;

    engine = new Engine({
      engineConfig: {
        apiKey: config.analytics.apolloEngine.key,
      },
      origins: [
        {
          backend: {
            url: apiUrl,
            supportsBatch: true,
          },
        },
      ],
      graphqlPort: serverPort, // GraphQL port
      endpoint: pathname, // GraphQL endpoint suffix - '/graphql' by default
    });

    engine.start();

    return engine.expressMiddleware();
  }

  return (req, res, next) => next();
};
