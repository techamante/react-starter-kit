import passport from 'passport';
import FieldError from '../shared/FieldError';
import authorize from '../../helpers/decorators';

export default () => ({
  Query: {
    currentUser(obj, args, ctx) {
      return ctx.user;
    },
  },

  Mutation: {
    async register(obj, { input }, { User }) {
      try {
        const e = new FieldError();

        const userExists = await User.getUserByUserName(input.username);
        if (userExists) {
          e.setError('username', 'Username already exists.');
        }
        e.throwIf();
        const user = new User({ ...input, role: 'User', isActive: true });
        await user.register();

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },

    async login(obj, { input }, { req }) {
      return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user) => {
          if (err) {
            reject(err);
          }
          if (!user) {
            reject('Invalid credentials.');
          }

          req.login(user, () => resolve(user));
        })({ body: input });
      });
    },

    @authorize()
    async logout(_, __, { req }) {
      try {
        req.logout();
        return true;
      } catch (e) {
        return false;
      }
    },
  },
});
