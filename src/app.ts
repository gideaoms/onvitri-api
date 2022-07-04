import path from 'path';
import ajv from 'ajv';
import fastify from 'fastify';
import autoload from 'fastify-autoload';
import cors from 'fastify-cors';
import multipart from 'fastify-multipart';
import staticy from 'fastify-static';
import helmet from '@fastify/helmet';
import { config } from '@/config';
import { sentry } from '@/libs/sentry';

function trim(ajv: ajv.Ajv) {
  ajv.addKeyword('trim', {
    type: 'string',
    compile: (schema) => {
      const validate: ajv.ValidateFunction = (data: string, _dataPath, parentData, parentDataProperty) => {
        if (!schema) return true;
        const trimmed = data.trim();
        if (parentData && parentDataProperty) {
          // eslint-disable-next-line no-param-reassign
          parentData[parentDataProperty] = trimmed;
        }
        return trimmed.length > 0;
      };
      return validate;
    },
  });
  return ajv;
}

export const app = fastify({
  logger: config.APP_ENV === 'development',
  ajv: {
    plugins: [trim],
  },
});

app.setErrorHandler(function cb(err, _request, replay) {
  if (err.validation) {
    replay.code(400).send({ statusCode: 400, message: err.message });
    return;
  }
  console.error(err);
  sentry.captureException(err);
  replay.code(500).send({ statusCode: 500, message: 'Internal server error' });
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
  options: { prefix: '/v1' },
});
