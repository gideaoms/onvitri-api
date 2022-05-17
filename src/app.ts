import path from 'path';
import fastify from 'fastify';
import autoload from 'fastify-autoload';
import cors from 'fastify-cors';
import multipart from 'fastify-multipart';
import staticy from 'fastify-static';
import config from '@/config';
import sentry from '@/libs/sentry';

const app = fastify({
  logger: config.APP_ENV === 'development',
});

app.setErrorHandler(function cb(err, _request, replay) {
  if (err.validation) {
    replay.code(400).send({ statusCode: 400, message: err.message });
    return;
  }
  this.log.error(err);
  sentry.captureException(err);
  replay.code(500).send({ statusCode: 500, message: 'Internal server error' });
});

app.register(cors, {
  exposedHeaders: ['x-has-more'],
});
app.register(staticy, {
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/photos',
});
app.register(multipart);
app.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  options: { prefix: '/v1' },
});

export default app;

// TODO: remove unused packages from package.json
