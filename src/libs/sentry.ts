import * as sentry from '@sentry/node';
import { config } from '@/config';
import '@sentry/tracing';

sentry.init({
  dsn: config.SENTRY_DSN,
  tracesSampleRate: config.NODE_ENV === 'production' ? 0.2 : 1,
});

export { sentry };
