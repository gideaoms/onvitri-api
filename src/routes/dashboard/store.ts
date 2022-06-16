import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { StoreService } from '@/services/dashboard/store';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { CryptoProvider } from '@/providers/crypto';
import { UserRepository } from '@/repositories/user';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { StoreRepository } from '@/repositories/dashboard/store';

const cryptoProvider = CryptoProvider();
const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const cityMapper = CityMapper();

async function Store(fastify: FastifyInstance) {
  fastify.route({
    url: '/stores/all',
    method: 'GET',
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              fantasy_name: {
                type: 'string',
              },
              street: {
                type: 'string',
              },
              number: {
                type: 'string',
              },
              neighborhood: {
                type: 'string',
              },
              phone: {
                type: 'object',
                properties: {
                  country_code: {
                    type: 'string',
                  },
                  area_code: {
                    type: 'string',
                  },
                  number: {
                    type: 'string',
                  },
                },
              },
              status: {
                type: 'string',
              },
              city: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  initials: {
                    type: 'string',
                  },
                },
              },
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
      const stores = await storeService.findAll(user.right);
      const object = stores.map((store) => ({
        ...storeMapper.toObject(store),
        city: cityMapper.toObject(store.city),
      }));
      return replay.send(object);
    },
  });
}

export default Store;
