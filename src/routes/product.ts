import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { ProductRepository } from '@/repositories/product';
import { StoreRepository } from '@/repositories/store';
import { ProductService } from '@/services/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';

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
      const page = request.query.page;
      const storeId = request.query.store_id;
      if (storeId) {
        const products = await productService.findManyByStore(storeId, page);
        if (isLeft(products)) {
          const httpStatus = findCodeByError(products.left);
          return replay.code(httpStatus).send({ message: products.left.message });
        }
        const object = products.right.data.map(productMapper.toObject);
        return replay.header('x-has-more', products.right.hasMore).send(object);
      }
      const { data: products, hasMore } = await productService.findMany(page);
      const object = products.map((product) => ({
        ...productMapper.toObject(product),
        store: storeMapper.toObject(product.store),
      }));
      return replay.header('x-has-more', hasMore).send(object);
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
                    url: 'string',
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
              },
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
      const object = {
        ...productMapper.toObject(product.right),
        store: storeMapper.toObject(product.right.store),
      };
      return replay.send(object);
    },
  });
}

export default Product;
