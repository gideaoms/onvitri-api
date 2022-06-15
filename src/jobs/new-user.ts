import { NewUserJob } from '@/types/jobs/new-user';
import { makeBull, handleFailure } from '@/libs/bull';
import { NewUserMailer } from '@/types/mailers/new-user';

export function NewUserJob(newUserMailer: NewUserMailer): NewUserJob {
  const bull = makeBull<{ name: string; email: string; code: string }>('new-user');

  function prepare() {
    bull.process((job) => {
      const { name, email, code } = job.data;
      newUserMailer.send(name, email, code);
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
