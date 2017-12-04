import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import decode from 'jwt-decode';
import User from '../server/modules/auth/models/User';

export default config => {
  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: 'http://localhost:3000/dialog/authorize',
        tokenURL: 'http://localhost:3000/oauth/token',
        clientID: 'abc123',
        clientSecret: 'ssh-secret',
        callbackURL: 'http://localhost:3000/callback',
        passReqToCallback: true,
        scope: 'offline_access',
      },
      async (req, accessToken, refreshToken, profile, cb) => {
        const { sub } = decode(accessToken);
        const user = await User.findById(sub);
        req.universalCookies.set('r-token', accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        req.universalCookies.set('r-refresh-token', refreshToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
        });
        cb(null, user);
      },
      5,
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.name);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = User.findById(id);
      done(null, user);
    } catch (ex) {
      done(ex);
    }
  });
};
