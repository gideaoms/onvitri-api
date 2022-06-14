import { NewSessionJob } from '@/types/jobs/new-session';
import { makeBull, handleFailure } from '@/libs/bull';
import { NewSessionMailer } from '@/types/mailers/new-session';

export function NewSessionJob(newSessionMailer: NewSessionMailer): NewSessionJob {
  const bull = makeBull<{ name: string; email: string; token: string }>('new-session');

  function prepare() {
    bull.process((job) => {
      const { name, email, token } = job.data;
      newSessionMailer.send(name, email, token);
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
