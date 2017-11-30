const User = require('../modules/auth/models/User').default;

const Promise = require('bluebird');
const extend = require('lodash').extend;
const getObjectRef = require('./utils').getObjectRef;

const stateRequired = ['google', 'linkedin'];

module.exports = function providers(router, passport, config) {
  // This is called after a user has successfully authenticated with a provider
  // If a user is authenticated with a bearer token we will link an account, otherwise log in
  // auth is an object containing 'access_token' and optionally 'refresh_token'
  async function authHandler(req, provider, auth, profile) {
    let user = await User.findOne({
      'providers.providerId': profile.id,
      'providers.provider': provider,
    }).exec();
    if (!user) {
      const tempUser = {
        role: 'user',
        profile: {},
      };

      if (profile.emails) {
        tempUser.email = profile.emails[0].value;
      }

      if (profile.username) {
        tempUser.username = profile.username.toLowerCase();
      } else if (tempUser.email) {
        // If a username isn't specified we'll take it from the email
        const parseEmail = tempUser.email.split('@');
        tempUser.username = parseEmail[0].toLowerCase();
      } else if (profile.displayName) {
        tempUser.username = profile.displayName
          .replace(/\s/g, '')
          .toLowerCase();
      } else {
        tempUser.username = profile.id.toLowerCase();
      }

      if (profile.name) {
        tempUser.profile.firstName = profile.name.givenName;
        tempUser.profile.lastName = profile.name.familyName;
      }

      tempUser.providers = {
        provider,
        providerId: profile.id,
        auth,
      };
      user = new User(tempUser);
      await user.save();
    }
    return user;
  }

  function getLinkCallbackURLs(provider, req, operation, accessToken) {
    if (accessToken) {
      accessToken = encodeURIComponent(accessToken);
    }
    const protocol = `${req.get('X-Forwarded-Proto') || req.protocol}://`;
    if (operation === 'login') {
      return `${protocol + req.get('host') + req.baseUrl}/auth/${
        provider
      }/callback`;
    }
    if (operation === 'link') {
      let reqUrl;
      if (
        accessToken &&
        (stateRequired.indexOf(provider) > -1 ||
          config.getItem(`providers.${provider}.stateRequired`) === true)
      ) {
        reqUrl = `${protocol + req.get('host') + req.baseUrl}/link/${
          provider
        }/callback`;
      } else {
        reqUrl = `${protocol + req.get('host') + req.baseUrl}/link/${
          provider
        }/callback?state=${accessToken}`;
      }
      return reqUrl;
    }
    return null;
  }

  // Configures the passport.authenticate for the given provider, passing in options
  // Operation is 'login' or 'link'
  function passportCallback(provider, options, operation) {
    return (req, res, next) => {
      const theOptions = extend({}, options);
      if (provider === 'linkedin') {
        theOptions.state = true;
      }
      const accessToken = req.query.bearer_token || req.query.state;
      if (
        accessToken &&
        (stateRequired.indexOf(provider) > -1 ||
          config.getItem(`providers.${provider}.stateRequired`) === true)
      ) {
        theOptions.state = accessToken;
      }
      theOptions.callbackURL = getLinkCallbackURLs(
        provider,
        req,
        operation,
        accessToken,
      );
      theOptions.successReturnToOrRedirect = '/';
      passport.authenticate(provider, theOptions)(req, res, next);
    };
  }

  // Framework to register OAuth providers with passport
  function registerProvider(provider, configFunction) {
    const providerName = provider.toLowerCase();
    const configRef = `providers.${providerName}`;
    if (getObjectRef(config, configRef)) {
      const credentials = getObjectRef(config, `${configRef}.credentials`);
      credentials.passReqToCallback = true;
      const options = getObjectRef(config, `${configRef}.options`) || {};
      configFunction.call(null, credentials, passport, authHandler);
      router.get(
        `/auth/${provider}`,
        passportCallback(provider, options, 'login'),
      );
      router.get(
        `/auth/${provider}/callback`,
        passportCallback(provider, options, 'login'),
      );

      console.log(`${provider} loaded.`);
    }
  }

  // A shortcut to register OAuth2 providers that follow the exact accessToken, refreshToken pattern.
  function registerOAuth2(providerName, Strategy) {
    registerProvider(providerName, credentials => {
      passport.use(
        new Strategy(
          credentials,
          (req, accessToken, refreshToken, profile, done) => {
            authHandler(
              req,
              providerName,
              { accessToken, refreshToken },
              profile,
            ).asCallback(done);
          },
        ),
      );
    });
  }

  return {
    registerOAuth2,
  };
};
