import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { ProductRepository } from '@/repositories/consumer/product';
import { ProductService } from '@/services/consumer/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { TokenProvider } from '@/providers/token';
import { UserRepository } from '@/repositories/user';
import { CryptoProvider } from '@/providers/crypto';
import { GuardianProvider } from '@/providers/guardian';

const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const cryptoProvider = CryptoProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const productRepository = ProductRepository();
const productMapper = ProductMapper();
const storeMapper = StoreMapper();
const productService = ProductService(productRepository);

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
              id: {
                type: 'string',
              },
              title: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              price: {
                type: 'integer',
              },
              status: {
                type: 'string',
              },
              photos: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
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
              store: {
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
                    type: 'number',
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
                  zip_code: {
                    type: 'string',
                  },
                  status: {
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
      const page = request.query.page;
      const user = await guardianProvider.passThrough('consumer', token);
      if (isLeft(user)) {
        const code = findCodeByError(user.left);
        return replay.code(code).send({ message: user.left.message });
      }
      const products = await productService.findMany(page, user.right);
      const object = products.data.map((product) => ({
        ...productMapper.toObject(product),
        store: storeMapper.toObject(product.store),
      }));
      return replay.header('x-has-more', products.hasMore).send(object);
    },
  });
}

export default Product;
