import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { SessionService } from '@/services/session';
import { UserRepository } from '@/repositories/user';
import { NewSessionJob } from '@/jobs/new-session';
import { NewSessionMailer } from '@/mailers/new-session';
import { CryptoProvider } from '@/providers/crypto';
import { findCodeByError } from '@/utils';
import { UserMapper } from '@/mappers/user';
import { TokenProvider } from '@/providers/token';

const userRepository = UserRepository();
const newSessionMailer = NewSessionMailer();
const newSessionJob = NewSessionJob(newSessionMailer);
const cryptoProvider = CryptoProvider();
const userMapper = UserMapper();
const tokenProvider = TokenProvider();
const sessionService = SessionService(userRepository, newSessionJob, cryptoProvider, tokenProvider);

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
      const user = await sessionService.create(email);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      return replay.send();
    },
  });

  fastify.route<{
    Body: {
      email: string;
      email_code: string;
    };
  }>({
    url: '/sessions/activate',
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          email_code: {
            type: 'string',
          },
        },
        required: ['email', 'email_code'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            roles: {
              type: 'array',
              format: 'string',
            },
            status: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const emailCode = request.body.email_code;
      const user = await sessionService.activate(email, emailCode);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      return replay.send(userMapper.toObject(user.right));
    },
  });
}

export default Session;
