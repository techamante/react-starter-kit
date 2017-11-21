/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import _ from 'lodash';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { seed as users } from '../data/auth';

import config from '../config';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('payload received', jwt_payload);
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
