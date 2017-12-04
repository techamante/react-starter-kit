import path from 'path';
import express from 'express';
import passport from 'passport';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import cookiesMiddleware from 'universal-cookie-express';
import session from 'express-session';
import passportConfig from './passport';

export default (app, config) => {
  app.set('view engine', 'ejs');
  app.set('views', `${__dirname}/views`);
  app.use(compress());

  if (__DEV__) {
    app.enable('trust proxy');
  }

  // data from html forms
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // read cookies (before sessions)
  app.use(cookieParser());
  app.use(cookiesMiddleware());

  // setup session
  app.use(
    session({
      secret: 'shhhhhhhhh',
      resave: true,
      saveUninitialized: true,
      key: 'authorization.sid',
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(config);
  app.use(flash());

  // static files
  app.use(express.static(path.resolve(__dirname, 'public')));
};
