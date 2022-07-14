import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findCodeByError } from '@/utils';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { CryptoProvider } from '@/providers/crypto';
import { TokenProvider } from '@/providers/token';
import { UserMapper } from '@/mappers/user';
import { SessionService } from '@/services/shopkeeper/session';
import { schemas } from '@/schemas';
import { NewSessionJob } from '@/jobs/new-session';
import { NewSessionMailer } from '@/mailers/new-session';
import { GuardianProvider } from '@/providers/guardian';

const userRepository = UserRepository();
const cryptoProvider = CryptoProvider();
const tokenProvider = TokenProvider();
const userMapper = UserMapper();
const newSessionMailer = NewSessionMailer();
const newSessionJob = NewSessionJob(newSessionMailer);
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const sessionService = SessionService(userRepository, cryptoProvider, tokenProvider, newSessionJob);

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
          },
        },
        required: ['email'],
      },
      response: {
        200: {
          type: 'object',
          properties: schemas.user,
        },
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const session = await sessionService.create(email);
      if (isFailure(session)) {
        const httpStatus = findCodeByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
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
          properties: schemas.user,
        },
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const emailCode = request.body.email_code;
      const session = await sessionService.activate(email, emailCode);
      if (isFailure(session)) {
        const httpStatus = findCodeByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
      }
      return replay.send(userMapper.toObject(session.success));
    },
  });

  fastify.route({
    url: '/sessions',
    method: 'GET',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: schemas.user,
        },
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const session = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(session)) {
        const httpStatus = findCodeByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
      }
      return replay.send(userMapper.toObject(session.success));
    },
  });
}

export default Session;
