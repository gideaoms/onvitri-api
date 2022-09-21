import { INewSessionJob } from '@/types/jobs/new-session';
import { makeBull, handleFailure } from '@/libs/bull';
import { INewSessionMailer } from '@/types/mailers/new-session';

export function NewSessionJob(newSessionMailer: INewSessionMailer): INewSessionJob {
  const bull = makeBull<{ name: string; email: string; validationCode: string }>('new-session');

  function prepare() {
    bull.process((job) => {
      const { name, email, validationCode } = job.data;
      newSessionMailer.send(name, email, validationCode);
    });
    bull.on('failed', handleFailure);
  }

  function addToQueue(name: string, email: string, validationCode: string) {
    return bull.add({
      name: name,
      email: email,
      validationCode: validationCode,
    });
  }

  return {
    prepare: prepare,
    addToQueue: addToQueue,
  };
}
