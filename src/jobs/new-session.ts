import { NewSessionJob } from '@/types/jobs/new-session';
import { makeBull, handleFailure } from '@/libs/bull';
import { NewSessionMailer } from '@/types/mailers/new-session';

export function NewSessionJob(newSessionMailer: NewSessionMailer): NewSessionJob {
  const bull = makeBull<{ name: string; email: string; code: string }>('new-session');

  function prepare() {
    bull.process((job) => {
      const { name, email, code } = job.data;
      newSessionMailer.send(name, email, code);
    });
    bull.on('failed', handleFailure);
  }

  function addToQueue(name: string, email: string, code: string) {
    return bull.add({
      name: name,
      email: email,
      code: code,
    });
  }

  return {
    prepare: prepare,
    addToQueue: addToQueue,
  };
}
