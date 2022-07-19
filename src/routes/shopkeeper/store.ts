import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { StoreService } from '@/services/shopkeeper/store';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { CryptoProvider } from '@/providers/crypto';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { StoreRepository } from '@/repositories/shopkeeper/store';
import { CitySchema, StoreSchema } from '@/schemas';

const cryptoProvider = CryptoProvider();
const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const cityMapper = CityMapper();

export default async function Store(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
      }),
      response: {
        200: Type.Array(Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })])),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const stores = await storeService.findMany(page, user.success);
      return replay.header('x-has-more', stores.hasMore).send(
        stores.data.map((store) => ({
          ...storeMapper.toObject(store),
          city: cityMapper.toObject(store.city),
        })),
      );
    },
  });
}
