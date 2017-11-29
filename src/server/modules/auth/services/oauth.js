import Promise from 'bluebird';
import { extend } from 'lodash';
import config from '../../../../config';
import { getObjectRef } from '../../../helpers/util';
import User from '../models/User';
import createTokens from './tokens';

const stateRequired = ['google', 'linkedin'];

export default function(router, passport) {
  function getLinkCallbackURLs(provider, req, operation, accessToken) {
    if (accessToken) {
      accessToken = encodeURIComponent(accessToken);
    }
    const protocol = `${req.get('X-Forwarded-Proto') || req.protocol}://`;
    if (operation === 'login') {
      return `${protocol + req.get('host') + req.baseUrl}/${provider}/callback`;
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
  }

  // Configures the passport.authenticate for the given provider, passing in options
  // Operation is 'login' or 'link'
  function passportCallback(provider, options, operation) {
    return function callback(req, res, next) {
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
      theOptions.session = false;

      passport.authenticate(provider, theOptions, async (err, user, info) => {
        if (user) {
          const [token] = await createTokens(user, config.auth.jwt.secretOrKey);
          req.universalCookies.set('Bearer', token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
          });
          return res.json(token);
        }
        return next();
      })(req, res, next);
    };
  }

  // This is called after a user has successfully authenticated with a provider
  // If a user is authenticated with a bearer token we will link an account, otherwise log in
  // auth is an object containing 'access_token' and optionally 'refresh_token'
  async function authHandler(req, provider, auth, profile) {
    let user = await User.findOne({
      [`providers.${provider}.id`]: profile.id,
    });
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
        id: profile.id,
        auth,
      };
      user = new User(tempUser);
      await user.save();
    }
    return user;
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
        `/${providerName}`,
        passportCallback(providerName, options, 'login'),
      );
      router.get(
        `/${provider}/callback`,
        passportCallback(provider, options, 'login'),
      );
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
}
