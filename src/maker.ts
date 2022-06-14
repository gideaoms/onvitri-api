import { SessionJob } from '@/jobs/session';
import { SessionMailer } from '@/mailers/session';

const sessionMailer = SessionMailer();

export const sessionJob = SessionJob(sessionMailer);
