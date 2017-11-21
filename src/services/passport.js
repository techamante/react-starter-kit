/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import _ from 'lodash';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { seed as users } from '../modules/auth';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(
  // eslint-disable-next-line
  new JwtStrategy(opts, (jwt_payload, done) => {
    // usually this would be a database call:
    const user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }),
);

export default passport;
