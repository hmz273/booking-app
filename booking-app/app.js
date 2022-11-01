import express from 'express';
import routes from '@router';
import logger from 'morgan';
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { createDirectories, isThisDirectoryExist } from '@utils/index';
import loggerBody from 'morgan-body';
import mongoose from 'mongoose';
import { appConfig } from '@config';
import bodyParser from 'body-parser';
import swaggerDocument from './swagger.json';

try {
  mongoose
    .connect(appConfig.databaseURL, {
      dbName: appConfig.databaseName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error(err);
    });
} catch (err) {
  console.error(err);
}

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

if (!isThisDirectoryExist('./logs')) {
  createDirectories('./logs', false);
}

app.use(
  logger('combined', {
    stream: fs.createWriteStream('./logs/app.log', { flags: 'a' }),
  })
);
app.use(logger('combined'));

const log = fs.createWriteStream('./logs/app_body.log', { flags: 'a' });

loggerBody(app, {
  noColors: true,
  stream: log,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Welcome to the API',
  });
});

app.use('/api', routes);

app.use(
  '/swagger',
  (req, res, next) => {
    swaggerDocument.host = req.get('host');
    swaggerDocument.schemes.http = req.protocol;
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

module.exports = app;
