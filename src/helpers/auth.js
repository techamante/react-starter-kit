import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../config';
import { FieldError } from '../modules/shared/';
import { seed as users } from '../modules/auth';

export const createTokens = async (user, secret, refreshSecret) => {
  const tokenUser = _.pick(user, ['id', 'username', 'role']);
  tokenUser.fullName = user.firstName
    ? `${user.firstName} ${user.lastName}`
    : null;

  const createToken = jwt.sign(
    {
      user: tokenUser,
    },
    secret,
    {
      expiresIn: '1m',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id,
    },
    refreshSecret,
    {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const tryLogin = async (email, password, User, SECRET = 'secret') => {
  const e = new FieldError();
  const user = users[_.findIndex(users, { userName: email })];

  // check if email and password exist in db
  if (!user || user.password === null) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.');
    e.throwIf();
  }

  //   const valid = await bcrypt.compare(password, user.password);
  //   if (!valid) {
  //     // bad password
  //     e.setError('password', 'Please enter a valid password.');
  //     e.throwIf();
  //   }

  //   if (settings.user.auth.password.confirm && !user.isActive) {
  //     e.setError('email', 'Please confirm your e-mail first.');
  //     e.throwIf();
  //   }

  const refreshSecret = SECRET + user.password;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    token,
    refreshToken,
  };
};
