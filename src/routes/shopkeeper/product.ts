import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
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
import { PhotoMapper } from '@/mappers/photo';
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
const photoMapper = PhotoMapper();
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
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      const products = await productService.findMany(page, user.right);
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
            trim: true,
            minLength: 1,
          },
          description: {
            type: 'string',
            trim: true,
            minLength: 1,
          },
          price: {
            type: 'integer',
          },
          photos: {
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
        required: ['store_id', 'title', 'description', 'price', 'photos', 'status'],
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
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      const storeId = request.body.store_id;
      const title = request.body.title;
      const description = request.body.description;
      const price = request.body.price;
      const photos = request.body.photos.map(photoMapper.fromObject);
      const status = request.body.status;
      const product = await productService.create(storeId, title, description, price, photos, status, user.right);
      if (isLeft(product)) {
        const httpStatus = findCodeByError(product.left);
        return replay.code(httpStatus).send({ message: product.left.message });
      }
      return replay.send({
        ...productMapper.toObject(product.right),
        store: {
          ...storeMapper.toObject(product.right.store),
          city: cityMapper.toObject(product.right.store.city),
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
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      const product = await productService.findOne(productId, user.right);
      if (isLeft(product)) {
        const httpStatus = findCodeByError(product.left);
        return replay.code(httpStatus).send({ message: product.left.message });
      }
      return replay.send({
        ...productMapper.toObject(product.right),
        store: {
          ...storeMapper.toObject(product.right.store),
          city: cityMapper.toObject(product.right.store.city),
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
            trim: true,
          },
          description: {
            type: 'string',
            minLength: 1,
            trim: true,
          },
          price: {
            type: 'integer',
          },
          photos: {
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
        required: ['title', 'description', 'price', 'photos', 'status'],
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
      if (isLeft(user)) {
        const code = findCodeByError(user.left);
        return replay.code(code).send({ message: user.left.message });
      }
      const productId = request.params.product_id;
      const title = request.body.title;
      const description = request.body.description;
      const price = request.body.price;
      const photos = request.body.photos.map(photoMapper.fromObject);
      const status = request.body.status;
      const updated = await productService.update(productId, title, description, price, photos, status, user.right);
      if (isLeft(updated)) {
        const code = findCodeByError(updated.left);
        return replay.code(code).send({ message: updated.left.message });
      }
      return replay.send({
        ...productMapper.toObject(updated.right),
        store: {
          ...storeMapper.toObject(updated.right.store),
          city: cityMapper.toObject(updated.right.store.city),
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
      if (isLeft(user)) {
        const code = findCodeByError(user.left);
        return replay.code(code).send({ message: user.left.message });
      }
      const productId = request.params.product_id;
      const removed = await productService.remove(productId, user.right);
      if (isLeft(removed)) {
        const code = findCodeByError(removed.left);
        return replay.code(code).send({ message: removed.left.message });
      }
      return replay.send();
    },
  });
}

export default Product;
