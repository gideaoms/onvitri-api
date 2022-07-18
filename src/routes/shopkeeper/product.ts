import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { Product } from '@/types/product';
import { ProductObject } from '@/types/objects/product';
import { ProductRepository } from '@/repositories/shopkeeper/product';
import { ProductService } from '@/services/shopkeeper/product';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { CryptoProvider } from '@/providers/crypto';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { PictureMapper } from '@/mappers/picture';
import { StoreRepository } from '@/repositories/shopkeeper/store';
import { schemas } from '@/schemas';

const userRepository = UserRepository();
const productRepository = ProductRepository();
const storeRepository = StoreRepository();
const cryptoProvider = CryptoProvider();
const tokenProvider = TokenProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const productMapper = ProductMapper();
const storeMapper = StoreMapper();
const pictureMapper = PictureMapper();
const cityMapper = CityMapper();
const productService = ProductService(productRepository, storeRepository);

async function Product(fastify: FastifyInstance) {
  fastify.route<{
    Querystring: {
      page: number;
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
        },
        required: ['page'],
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
      const products = await productService.findMany(page, user.success);
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

  fastify.route<{
    Body: ProductObject;
  }>({
    url: '/products',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          store_id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
            minLength: 1,
          },
          description: {
            type: 'string',
            minLength: 1,
          },
          price: {
            type: 'integer',
            minimum: 1,
          },
          pictures: {
            type: 'array',
            maxItems: 6,
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                url: {
                  type: 'string',
                },
                thumbnail_url: {
                  type: 'string',
                },
              },
            },
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
          },
        },
        required: ['store_id', 'title', 'description', 'price', 'pictures', 'status'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ...schemas.product,
            store: {
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
      const product = await productService.create(storeId, title, description, price, pictures, status, user.success);
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

  fastify.route<{
    Params: {
      product_id: string;
    };
    Body: ProductObject;
  }>({
    url: '/products/:product_id',
    method: 'PUT',
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
      body: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1,
          },
          description: {
            type: 'string',
            minLength: 1,
          },
          price: {
            type: 'integer',
            minimum: 1,
          },
          pictures: {
            type: 'array',
            maxItems: 6,
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                url: {
                  type: 'string',
                },
                thumbnail_url: {
                  type: 'string',
                },
              },
            },
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
          },
        },
        required: ['title', 'description', 'price', 'pictures', 'status'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ...schemas.product,
            store: {
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
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const code = findHttpStatusByError(user.failure);
        return replay.code(code).send({ message: user.failure.message });
      }
      const productId = request.params.product_id;
      const title = request.body.title;
      const description = request.body.description;
      const price = request.body.price;
      const pictures = request.body.pictures.map(pictureMapper.fromObject);
      const status = request.body.status;
      const updated = await productService.update(productId, title, description, price, pictures, status, user.success);
      if (isFailure(updated)) {
        const code = findHttpStatusByError(updated.failure);
        return replay.code(code).send({ message: updated.failure.message });
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

  fastify.route<{
    Params: {
      product_id: string;
    };
  }>({
    url: '/products/:product_id',
    method: 'DELETE',
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
    },
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const code = findHttpStatusByError(user.failure);
        return replay.code(code).send({ message: user.failure.message });
      }
      const productId = request.params.product_id;
      const removed = await productService.remove(productId, user.success);
      if (isFailure(removed)) {
        const code = findHttpStatusByError(removed.failure);
        return replay.code(code).send({ message: removed.failure.message });
      }
      return replay.send();
    },
  });
}

export default Product;
