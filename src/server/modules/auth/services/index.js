import express from 'express';
import passport from 'passport';
import Oauth from './oauth';
import User from '../models/User';
import local from './local';
import config from '../../../../config';

export default function() {
  const router = express.Router();

  const oauth = new Oauth(router, passport, User);
  local(config, passport, User);

  function authenticate(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (user) {
        return req.login(user, () => next());
      }
      return next();
    })(req, res, next);
  }

  return {
    router,
    registerOAuth2: oauth.registerOAuth2,
    authenticate,
  };
}
