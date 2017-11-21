import { tryLogin } from '../../helpers/auth';

export default pubsub => ({
  Mutation: {
    async login(obj, { input: { email, password } }) {
      console.log('I am at login');
      try {
        const tokens = await tryLogin(email, password);
        return { tokens };
      } catch (e) {
        return { errors: e };
      }
    },
  },
});
