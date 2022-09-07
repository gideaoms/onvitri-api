import Bull, { Job } from 'bull';
import { sentry } from '@/libs/sentry';
import { config } from '@/config';

export function makeBull<TemplateVars>(name: string) {
  return new Bull<TemplateVars>(name, {
    redis: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASS,
    },
  });
}

export function handleFailure(job: Job, err: Error) {
  if (config.NODE_ENV === 'production') {
    sentry.captureException({ job: job, err: err });
  } else {
    console.error(job, err);
  }
}
