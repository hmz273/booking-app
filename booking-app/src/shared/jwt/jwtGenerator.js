import jwt from 'jsonwebtoken';
import { appConfig } from '@config';
import { options } from '@shared/jwt/options';
import { ROLES } from '@shared/constants';

export const generateJwt = async ({ userId, role = ROLES.USER, secret }) => {
  try {
    const payload = { id: userId, role };
    const token = await jwt.sign(
      payload,
      secret || appConfig.jwtSecret,
      options
    );
    return { error: false, token };
  } catch (error) {
    return { error: true };
  }
};
