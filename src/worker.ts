import { NewSessionJob } from '@/jobs/new-session';
import { NewSessionMailer } from '@/mailers/new-session';

const newSessionMailer = NewSessionMailer();
const newSessionJob = NewSessionJob(newSessionMailer);

newSessionJob.prepare();
