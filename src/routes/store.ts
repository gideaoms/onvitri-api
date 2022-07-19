import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { StoreRepository } from '@/repositories/store';
import { StoreService } from '@/services/store';
import { StoreMapper } from '@/mappers/store';
import { ProductMapper } from '@/mappers/product';
import { CityMapper } from '@/mappers/city';
import { CitySchema, ProductSchema, StoreSchema } from '@/schemas';

const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const productMapper = ProductMapper();
const cityMapper = CityMapper();

export default async function Store(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores/:store_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Intersect([StoreSchema, Type.Object({ city: CitySchema, products: Type.Array(ProductSchema) })]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const storeId = request.params.store_id;
      const store = await storeService.findOne(storeId);
      if (isFailure(store)) {
        const httpStatus = findHttpStatusByError(store.failure);
        return replay.code(httpStatus).send({ message: store.failure.message });
      }
      return replay.header('x-has-more', store.success.products.hasMore).send({
        ...storeMapper.toObject(store.success),
        city: cityMapper.toObject(store.success.city),
        products: store.success.products.data.map(productMapper.toObject),
      });
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/stores',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        city_id: Type.String({ format: 'uuid' }),
        page: Type.Number(),
      }),
      response: {
        200: Type.Array(Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })])),
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
