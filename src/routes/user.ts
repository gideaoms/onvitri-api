import { FastifyInstance } from 'fastify';
import { UserRepository } from '@/repositories/user';
import { CryptoProvider } from '@/providers/crypto';
import { UserService } from '@/services/user';
import { NewUserJob } from '@/jobs/new-user';
import { NewUserMailer } from '@/mailers/new-user';
import { UserMapper } from '@/mappers/user';

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
      replay.send(userMapper.toObject(user));
    },
  });
}

export default User;
