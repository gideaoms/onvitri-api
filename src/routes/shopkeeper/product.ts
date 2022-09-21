import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { Product } from '@/types/product';
import { ProductRepository } from '@/repositories/shopkeeper/product';
import { ProductService } from '@/services/shopkeeper/product';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { PictureMapper } from '@/mappers/picture';
import { StoreRepository } from '@/repositories/shopkeeper/store';
import { CitySchema, ProductSchema, StoreSchema } from '@/schemas';

const userRepository = UserRepository();
const productRepository = ProductRepository();
const storeRepository = StoreRepository();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository);
const productMapper = ProductMapper();
const storeMapper = StoreMapper();
const pictureMapper = PictureMapper();
const cityMapper = CityMapper();
const productService = ProductService(productRepository, storeRepository);

export default async function Product(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
        store_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        200: Type.Array(
          Type.Intersect([
            ProductSchema,
            Type.Object({
              store: Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })]),
            }),
          ]),
        ),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const storeId = request.query.store_id;
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const products = await productService.findMany(page, storeId, user.success);
      return replay.header('x-has-more', products.hasMore).send(
        products.data.map((product) => ({
          ...productMapper.toObject(product),
          store: {
            ...storeMapper.toObject(product.store),
            city: cityMapper.toObject(product.store.city),
          },
        })),
      );
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products',
    method: 'POST',
    schema: {
      body: Type.Object({
        store_id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        description: Type.String(),
        price: Type.Integer(),
        status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
        pictures: Type.Array(
          Type.Object({
            id: Type.String({ format: 'uuid' }),
            variants: Type.Array(
              Type.Object({
                url: Type.String(),
                ext: Type.String(),
                name: Type.String(),
                size: Type.Enum({ sm: 'sm' as const, md: 'md' as const }),
                width: Type.Integer(),
                height: Type.Integer(),
              }),
            ),
          }),
        ),
      }),
      response: {
        200: Type.Intersect([
          ProductSchema,
          Type.Object({ store: Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })]) }),
        ]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const storeId = request.body.store_id;
      const title = request.body.title;
      const description = request.body.description;
      const price = request.body.price;
      const pictures = request.body.pictures.map(pictureMapper.fromObject);
      const status = request.body.status;
      const product = await productService.create(
        storeId,
        title,
        description,
        price,
        pictures,
        status,
        user.success,
      );
      if (isFailure(product)) {
        const httpStatus = findHttpStatusByError(product.failure);
        return replay.code(httpStatus).send({ message: product.failure.message });
      }
      return replay.send({
        ...productMapper.toObject(product.success),
        store: {
          ...storeMapper.toObject(product.success.store),
          city: cityMapper.toObject(product.success.store.city),
        },
      });
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
        200: Type.Intersect([
          ProductSchema,
          Type.Object({ store: Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })]) }),
        ]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const productId = request.params.product_id;
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const product = await productService.findOne(productId, user.success);
      if (isFailure(product)) {
        const httpStatus = findHttpStatusByError(product.failure);
        return replay.code(httpStatus).send({ message: product.failure.message });
      }
      return replay.send({
        ...productMapper.toObject(product.success),
        store: {
          ...storeMapper.toObject(product.success.store),
          city: cityMapper.toObject(product.success.store.city),
        },
      });
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'PUT',
    schema: {
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      body: Type.Object({
        title: Type.String(),
        description: Type.String(),
        price: Type.Integer(),
        status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
        pictures: Type.Array(
          Type.Object({
            id: Type.String({ format: 'uuid' }),
            variants: Type.Array(
              Type.Object({
                url: Type.String(),
                ext: Type.String(),
                name: Type.String(),
                size: Type.Enum({ sm: 'sm' as const, md: 'md' as const }),
                width: Type.Integer(),
                height: Type.Integer(),
              }),
            ),
          }),
        ),
      }),
      response: {
        200: Type.Intersect([
          ProductSchema,
          Type.Object({ store: Type.Intersect([StoreSchema, Type.Object({ city: CitySchema })]) }),
        ]),
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const productId = request.params.product_id;
      const title = request.body.title;
      const description = request.body.description;
      const price = request.body.price;
      const pictures = request.body.pictures.map(pictureMapper.fromObject);
      const status = request.body.status;
      const updated = await productService.update(
        productId,
        title,
        description,
        price,
        pictures,
        status,
        user.success,
      );
      if (isFailure(updated)) {
        const httpStatus = findHttpStatusByError(updated.failure);
        return replay.code(httpStatus).send({ message: updated.failure.message });
      }
      return replay.send({
        ...productMapper.toObject(updated.success),
        store: {
          ...storeMapper.toObject(updated.success.store),
          city: cityMapper.toObject(updated.success.store.city),
        },
      });
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/products/:product_id',
    method: 'DELETE',
    schema: {
      params: Type.Object({
        product_id: Type.String({ format: 'uuid' }),
      }),
      response: {
        '4xx': Type.Object({ message: Type.String() }),
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const productId = request.params.product_id;
      const removed = await productService.remove(productId, user.success);
      if (isFailure(removed)) {
        const httpStatus = findHttpStatusByError(removed.failure);
        return replay.code(httpStatus).send({ message: removed.failure.message });
      }
      return replay.send();
    },
  });
}
