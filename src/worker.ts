import { SessionJob } from '@/jobs/session';
import { SessionMailer } from '@/mailers/session';

const sessionMailer = SessionMailer();
const sessionJob = SessionJob(sessionMailer);

sessionJob.prepare();

// setTimeout(() => {
//   sessionJob.addToQueue('Gideão', 'gideaoms@gmail.com', 'a1b2c3');
// }, 3000);
