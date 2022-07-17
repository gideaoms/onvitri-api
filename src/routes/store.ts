import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findCodeByError } from '@/utils';
import { StoreRepository } from '@/repositories/store';
import { StoreService } from '@/services/store';
import { StoreMapper } from '@/mappers/store';
import { ProductMapper } from '@/mappers/product';
import { CityMapper } from '@/mappers/city';
import { schemas } from '@/schemas';

const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const productMapper = ProductMapper();
const cityMapper = CityMapper();

async function Store(fastify: FastifyInstance) {
  fastify.route<{
    Params: {
      store_id: string;
    };
  }>({
    url: '/stores/:store_id',
    method: 'GET',
    schema: {
      params: {
        type: 'object',
        properties: {
          store_id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['store_id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ...schemas.store,
            city: {
              type: 'object',
              properties: schemas.city,
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: schemas.product,
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const storeId = request.params.store_id;
      const store = await storeService.findOne(storeId);
      if (isFailure(store)) {
        const code = findCodeByError(store.failure);
        return replay.code(code).send({ message: store.failure.message });
      }
      return replay.header('x-has-more', store.success.products.hasMore).send({
        ...storeMapper.toObject(store.success),
        city: cityMapper.toObject(store.success.city),
        products: store.success.products.data.map(productMapper.toObject),
      });
    },
  });

  fastify.route<{
    Querystring: {
      page: number;
      city_id: string;
    };
  }>({
    url: '/stores',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            format: 'uuid',
          },
          page: {
            type: 'number',
          },
        },
        required: ['city_id', 'page'],
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
      const cityId = request.query.city_id;
      const page = request.query.page;
      const stores = await storeService.findManyByCity(cityId, page);
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
