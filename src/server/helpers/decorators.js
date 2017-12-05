import withAuth from 'graphql-auth';
import { Model as model } from 'mongoose-model-decorators';
import mongoose from 'mongoose';

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

export function withModel(collection) {
  return function auth(t) {
    delete mongoose.connection.models[collection];
    return model(collection)(t);
  };
}
