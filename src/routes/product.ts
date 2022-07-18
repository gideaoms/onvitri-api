import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { ProductRepository } from '@/repositories/product';
import { StoreRepository } from '@/repositories/store';
import { ProductService } from '@/services/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { schemas } from '@/schemas';

const productRepository = ProductRepository();
const storeRepository = StoreRepository();
const productService = ProductService(productRepository, storeRepository);
const productMapper = ProductMapper();
const storeMapper = StoreMapper();

async function Product(fastify: FastifyInstance) {
  fastify.route<{
    Querystring: {
      page: number;
      store_id: string;
      city_id: string;
    };
  }>({
    url: '/products',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
          },
          store_id: {
            type: 'string',
            format: 'uuid',
          },
          city_id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['page'],
        if: {
          properties: {
            store_id: false,
          },
        },
        then: {
          required: ['city_id'],
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...schemas.product,
              store: {
                type: 'object',
                properties: schemas.store,
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const storeId = request.query.store_id;
      const cityId = request.query.city_id;
      if (storeId) {
        const products = await productService.findManyByStore(storeId, page);
        if (isFailure(products)) {
          const httpStatus = findHttpStatusByError(products.failure);
          return replay.code(httpStatus).send({ message: products.failure.message });
        }
        return replay
          .header('x-has-more', products.success.hasMore)
          .send(products.success.data.map(productMapper.toObject));
      }
      const products = await productService.findManyByCity(cityId, page);
      return replay.header('x-has-more', products.hasMore).send(
        products.data.map((product) => ({
          ...productMapper.toObject(product),
          store: storeMapper.toObject(product.store),
        })),
      );
    },
  });

  fastify.route<{
    Params: {
      product_id: string;
    };
  }>({
    url: '/products/:product_id',
    method: 'GET',
    schema: {
      params: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['product_id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ...schemas.product,
            store: {
              type: 'object',
              properties: schemas.store,
            },
          },
        },
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

export default Product;
