import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findCodeByError } from '@/utils';
import { StoreService } from '@/services/shopkeeper/store';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { CryptoProvider } from '@/providers/crypto';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { StoreRepository } from '@/repositories/shopkeeper/store';
import { schemas } from '@/schemas';

const cryptoProvider = CryptoProvider();
const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const cityMapper = CityMapper();

async function Store(fastify: FastifyInstance) {
  fastify.route<{
    Querystring: {
      page: number;
    };
  }>({
    url: '/stores',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
          },
        },
        required: ['page'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...schemas.store,
              city: {
                type: 'object',
                properties: schemas.city,
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findCodeByError(user.failure);
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

export default Store;
