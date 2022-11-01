import { appConfig } from '@config';

export const options = {
  expiresIn: appConfig.jwtExpiration,
};
