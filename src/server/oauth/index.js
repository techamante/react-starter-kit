import express from 'express';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';
import OAuth2Providers from './oauth2Providers';
import site from './site';
import oauth2 from './oauth2';
import token from './token';
import user from './user';
import client from './client';
import config from '../../config';

const router = express.Router();

const oauth = new OAuth2Providers(router, passport, config);

oauth.registerOAuth2('google', GoogleStrategy);
oauth.registerOAuth2('facebook', FacebookStrategy);

router.get('/auth', site.index);
router.get('/login', site.loginForm);
router.post('/login', site.login);
router.get('/logout', site.logout);
router.get('/account', site.account);

router.get('/dialog/authorize', oauth2.authorization);
router.post('/dialog/authorize/decision', oauth2.decision);
router.post('/oauth/token', oauth2.token);
router.get('/api/tokeninfo', token.info);
router.get('/api/revoke', token.revoke);

router.get('/api/userinfo', user.info);
router.get('/api/clientinfo', client.info);

export default router;
