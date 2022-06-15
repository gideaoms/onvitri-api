import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { UserRepository } from '@/repositories/user';
import { CryptoProvider } from '@/providers/crypto';
import { UserService } from '@/services/user';
import { NewUserJob } from '@/jobs/new-user';
import { NewUserMailer } from '@/mailers/new-user';
import { UserMapper } from '@/mappers/user';
import { findCodeByError } from '@/utils';

const userRepository = UserRepository();
const cryptoProvider = CryptoProvider();
const newUserMailer = NewUserMailer();
const newUserJob = NewUserJob(newUserMailer);
const userService = UserService(userRepository, cryptoProvider, newUserJob);
const userMapper = UserMapper();

async function User(fastify: FastifyInstance) {
  fastify.route<{
    Body: {
      name: string;
      email: string;
    };
  }>({
    url: '/users',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
        },
        required: ['name', 'email'],
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
              type: 'string',
            },
            status: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const { name, email } = request.body;
      const user = await userService.create(name, email);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      return replay.send(userMapper.toObject(user.right));
    },
  });

  fastify.route<{
    Body: {
      email: string;
      email_code: string;
    };
  }>({
    url: '/users/activate',
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
              type: 'string',
            },
            status: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const emailCode = request.body.email_code;
      const user = await userService.activate(email, emailCode);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      return replay.send(userMapper.toObject(user.right));
    },
  });
}

export default User;
