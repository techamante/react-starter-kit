import { tryLogin } from '../../helpers/auth';

export default () => ({
  Mutation: {
    async login(obj, { input: { email, password } }) {
      try {
        const tokens = await tryLogin(email, password);
        return { tokens };
      } catch (e) {
        return { errors: e };
      }
    },
  },
});
