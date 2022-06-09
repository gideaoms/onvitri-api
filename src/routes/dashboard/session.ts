import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { UserRepository } from '@/repositories/user';
import { CryptoProvider } from '@/providers/crypto';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { UserMapper } from '@/mappers/user';
import { SessionService } from '@/services/dashboard/session';

const userRepository = UserRepository();
const cryptoProvider = CryptoProvider();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const userMapper = UserMapper();
const sessionService = SessionService(userRepository, cryptoProvider, tokenProvider);

async function Session(fastify: FastifyInstance) {
  fastify.route<{
    Body: {
      email: string;
      password: string;
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
          password: {
            type: 'string',
          },
        },
        required: ['email', 'password'],
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
      const { email, password } = request.body;
      const session = await sessionService.create(email, password);
      if (isLeft(session)) {
        const httpStatus = findCodeByError(session.left);
        return replay.code(httpStatus).send({ message: session.left.message });
      }
      const object = userMapper.toObject(session.right);
      return replay.send(object);
    },
  });

  fastify.route({
    url: '/sessions',
    method: 'GET',
    schema: {
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
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      const object = userMapper.toObject(user.right);
      return replay.send(object);
    },
  });
}

export default Session;
