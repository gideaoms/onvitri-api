import path from 'path';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticy from '@fastify/static';
import helmet from '@fastify/helmet';
import { config } from '@/config';
import { sentry } from '@/libs/sentry';

export const app = fastify({
  logger: config.NODE_ENV === 'development',
});

app.setErrorHandler(async (err) => {
  console.error(err);
  sentry.captureException(err);
  throw err;
});

app.register(helmet);
app.register(cors, {
  exposedHeaders: ['x-has-more'],
});
app.register(staticy, {
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/pictures',
});
app.register(multipart);
app.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  options: { prefix: config.NODE_ENV === 'production' ? '' : '/v1' },
});
