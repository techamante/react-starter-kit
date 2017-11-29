import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import config from '../../../../config';

export default async (user, secret) => {
  const tokenUser = pick(user, ['id', 'username', 'role']);
  tokenUser.fullName = user.firstName
    ? `${user.firstName} ${user.lastName}`
    : null;

  const { secretOrKey, issuer, audience } = config.auth.jwt;
  const createToken = jwt.sign(
    {
      user: tokenUser,
    },
    secretOrKey,
    {
      issuer,
      audience,
      expiresIn: '20m',
    },
  );

  return Promise.all([createToken]);
};
