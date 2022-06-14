import { SessionJob } from '@/types/jobs/session';
import { makeBull, handleFailure } from '@/libs/bull';
import { SessionMailer } from '@/types/mailers/session';

export function SessionJob(sessionMailer: SessionMailer): SessionJob {
  const bull = makeBull<{ name: string; email: string; token: string }>();

  function prepare() {
    bull.process((job) => {
      const { name, email, token } = job.data;
      sessionMailer.send(name, email, token);
    });
    bull.on('failed', handleFailure);
  }

  function addToQueue(name: string, email: string, token: string) {
    return bull.add({
      name: name,
      email: email,
      token: token,
    });
  }

  return {
    prepare: prepare,
    addToQueue: addToQueue,
  };
}
