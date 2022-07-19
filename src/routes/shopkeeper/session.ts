import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { CryptoProvider } from '@/providers/crypto';
import { TokenProvider } from '@/providers/token';
import { UserMapper } from '@/mappers/user';
import { SessionService } from '@/services/shopkeeper/session';
import { NewSessionMailer } from '@/mailers/new-session';
import { GuardianProvider } from '@/providers/guardian';
import { UserSchema } from '@/schemas';

const userRepository = UserRepository();
const cryptoProvider = CryptoProvider();
const tokenProvider = TokenProvider();
const userMapper = UserMapper();
const newSessionMailer = NewSessionMailer();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const sessionService = SessionService(userRepository, cryptoProvider, tokenProvider, newSessionMailer);

export default async function Session(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions',
    method: 'POST',
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
      }),
      response: {
        200: UserSchema,
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const session = await sessionService.create(email);
      if (isFailure(session)) {
        const httpStatus = findHttpStatusByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
      }
      return replay.send();
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions/activate',
    method: 'PUT',
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        validation_code: Type.String(),
      }),
      response: {
        200: UserSchema,
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const email = request.body.email;
      const validationCode = request.body.validation_code;
      const session = await sessionService.activate(email, validationCode);
      if (isFailure(session)) {
        const httpStatus = findHttpStatusByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
      }
      return replay.send(userMapper.toObject(session.success));
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/sessions',
    method: 'GET',
    schema: {
      response: {
        200: UserSchema,
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const session = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(session)) {
        const httpStatus = findHttpStatusByError(session.failure);
        return replay.code(httpStatus).send({ message: session.failure.message });
      }
      return replay.send(userMapper.toObject(session.success));
    },
  });
}
