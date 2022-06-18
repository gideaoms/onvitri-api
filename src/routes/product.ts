import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
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
        if (isLeft(products)) {
          const httpStatus = findCodeByError(products.left);
          return replay.code(httpStatus).send({ message: products.left.message });
        }
        return replay
          .header('x-has-more', products.right.hasMore)
          .send(products.right.data.map(productMapper.toObject));
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
      if (isLeft(product)) {
        const httpStatus = findCodeByError(product.left);
        return replay.code(httpStatus).send({ message: product.left.message });
      }
      return replay.send({
        ...productMapper.toObject(product.right),
        store: storeMapper.toObject(product.right.store),
      });
    },
  });
}

export default Product;
