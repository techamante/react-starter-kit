import withAuth from 'graphql-auth';

export default function authorize(scope) {
  return function auth(t, n, descriptor) {
    const desc = descriptor;
    const original = descriptor.value;
    if (typeof original === 'function') {
      desc.value = withAuth(scope, original);
      return desc;
    }
    return descriptor;
  };
}
