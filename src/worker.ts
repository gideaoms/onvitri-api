import { NewSessionJob } from '@/jobs/new-session';
import { NewUserJob } from '@/jobs/new-user';
import { NewSessionMailer } from '@/mailers/new-session';
import { NewUserMailer } from '@/mailers/new-user';

const newSessionMailer = NewSessionMailer();
const newUserMailer = NewUserMailer();
const newSessionJob = NewSessionJob(newSessionMailer);
const newUserJob = NewUserJob(newUserMailer);

newSessionJob.prepare();
newUserJob.prepare();
