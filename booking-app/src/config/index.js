require('dotenv').config();

export const appConfig = {
  databaseURL: process.env.DATABASE_URL,
  port: process.env.PORT,
  jwtExpiration: process.env.JWT_EXPIRATION_TIME,
  jwtSecret: process.env.JWT_SECRET,
  databaseName: process.env.DATABASE_NAME,
  emailSecret: process.env.EMAIL_SECRET,
  serverURL: process.env.SERVER_URL,
};
