import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { ProductRepository } from '@/repositories/product';
import { StoreRepository } from '@/repositories/store';
import { ProductService } from '@/services/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { ProductSchema, StoreSchema } from '@/schemas';

const productRepository = ProductRepository();
const storeRepository = StoreRepository();
const productService = ProductService(productRepository, storeRepository);
const productMapper = ProductMapper();
const storeMapper = StoreMapper();

export default async function Product(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products-by-city',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
        city_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Array(Type.Intersect([ProductSchema, Type.Object({ store: StoreSchema })])),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const cityId = request.query.city_id;
      const products = await productService.findManyByCity(cityId, page);
      return replay.header('x-has-more', products.hasMore).send(
        products.data.map((product) => ({
          ...productMapper.toObject(product),
          store: storeMapper.toObject(product.store),
        })),
      );
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products-by-store',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
        store_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Array(ProductSchema),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const storeId = request.query.store_id;
      const products = await productService.findManyByStore(storeId, page);
      if (isFailure(products)) {
        const httpStatus = findHttpStatusByError(products.failure);
        return replay.code(httpStatus).send({ message: products.failure.message });
      }
      return replay
        .header('x-has-more', products.success.hasMore)
        .send(products.success.data.map(productMapper.toObject));
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'GET',
    schema: {
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Intersect([ProductSchema, Type.Object({ store: StoreSchema })]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const productId = request.params.product_id;
      const product = await productService.findOne(productId);
      if (isFailure(product)) {
        const httpStatus = findHttpStatusByError(product.failure);
        return replay.code(httpStatus).send({ message: product.failure.message });
      }
      return replay.send({
        ...productMapper.toObject(product.success),
        store: storeMapper.toObject(product.success.store),
      });
    },
  });
}
