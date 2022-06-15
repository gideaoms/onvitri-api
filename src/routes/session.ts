import { FastifyInstance } from 'fastify';
import { SessionService } from '@/services/session';
import { UserRepository } from '@/repositories/user';
import { NewSessionJob } from '@/jobs/new-session';
import { NewSessionMailer } from '@/mailers/new-session';
import { CryptoProvider } from '@/providers/crypto';

const userRepository = UserRepository();
const newSessionMailer = NewSessionMailer();
const newSessionJob = NewSessionJob(newSessionMailer);
const cryptoProvider = CryptoProvider();
const sessionService = SessionService(userRepository, newSessionJob, cryptoProvider);

async function Session(fastify: FastifyInstance) {
  fastify.route<{
    Body: {
      email: string;
    };
  }>({
    url: '/sessions',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
        },
        required: ['email'],
      },
    },
    async handler(request, replay) {
      const { email } = request.body;
      await sessionService.create(email);
      replay.send();
    },
  });
}

export default Session;
