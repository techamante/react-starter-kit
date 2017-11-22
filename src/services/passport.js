/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { User } from '../modules/auth';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(
  // eslint-disable-next-line
  new JwtStrategy(opts, (jwt_payload, done) => {
    // usually this would be a database call:
    const user = null;
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }),
);

// Local Strategy

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (req, id, done) => {
  try {
    const user = await User.findById(id);
    // req.auth = {
    //   user,
    //   isAuthenticated: true,
    //   scope: scopes[user.get('role')],
    // };
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

passport.use(
  new LocalStrategy({}, async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false);
    }
    return done(null, user);
  }),
);

export default passport;
