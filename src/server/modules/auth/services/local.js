import { Strategy as LocalStrategy } from 'passport-local';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

function cookieExtractor(req) {
  let token = null;
  if (req && req.universalCookies) {
    token = req.universalCookies.get('Bearer');
  }
  return token;
}

function configureJwt({ auth: { jwt: { secretOrKey, issuer, audience } } }) {
  const opts = { secretOrKey, issuer, audience };
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]);

  return opts;
}

export default (config, passport, User) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (req, id, done) => {
    try {
      const user = await User.findById(id);
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

  const opts = configureJwt(config);
  passport.use(
    // eslint-disable-next-line
    new JwtStrategy(opts, async ({ user: { id } }, done) => {
      const user = await User.findById(id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }),
  );
};
