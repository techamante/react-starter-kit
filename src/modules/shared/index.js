import Feature from '../connector';
import SharedTypes from './types.graphql';

export { default as FieldError } from './FieldError';

export default new Feature({
  schema: [SharedTypes],
});
