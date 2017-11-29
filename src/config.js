/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

export default {
  // Node.js app
  port: process.env.PORT || 3000,

  logging: true,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  mongoURI:
    'mongodb://anujmalla:password@ds259305.mlab.com:59305/pq-emaily-dev',

  // GraphQL

  graphQL: {
    isPersistedQueries: true,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X,

    apolloEngine: {
      key: 'service:techamante-purplequantum:0vODDEsdRhyw705Ii9Efjg', // Set your Apollo Engine key here
    },
  },

  providers: {
    google: {
      credentials: {
        clientID:
          '207707901314-0hlvtbmjdk5eqjn5qm71t92u0vdu2mru.apps.googleusercontent.com',
        clientSecret: 'tQGFkecQeQ4K7pW8_Fen6N2G',
      },
      options: {
        scope: ['profile', 'email'],
      },
    },
    facebook: {
      credentials: {
        clientID: '1881281178855983',
        clientSecret: '6f3024813f176329d38ef6ea4c15aa95',
        profileURL: 'https://graph.facebook.com/v2.4/me',
        profileFields: [
          'id',
          'name',
          'displayName',
          'emails',
          'age_range',
          'link',
          'gender',
          'locale',
          'timezone',
          'updated_time',
          'verified',
          'picture',
          'cover',
        ],
      },
      options: {
        scope: ['email', 'public_profile'],
        display: 'popup',
      },
    },
  },

  // Authentication
  auth: {
    jwt: {
      secretOrKey: process.env.JWT_SECRET || 'React Starter Kit',
      issuer: 'purplequantum',
      audience: 'yoursite',
    },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '1881281178855983',
      secret:
        process.env.FACEBOOK_APP_SECRET || '6f3024813f176329d38ef6ea4c15aa95',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID ||
        '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret:
        process.env.TWITTER_CONSUMER_SECRET ||
        'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
    },
  },
};
