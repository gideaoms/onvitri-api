import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import StoreRepository from '@/repositories/store';
import StoreService from '@/services/store';
import StoreMapper from '@/mappers/store';
import ProductMapper from '@/mappers/product';
import CityMapper from '@/mappers/city';

const storeRepository = StoreRepository();
const storeService = StoreService(storeRepository);
const storeMapper = StoreMapper();
const productMapper = ProductMapper();
const cityMapper = CityMapper();

async function Product(fastify: FastifyInstance) {
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
            city: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
                initials: {
                  type: 'string',
                },
              },
            },
            products: {
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
                },
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const storeId = request.params.store_id;
      const store = await storeService.findOne(storeId);
      if (isLeft(store)) {
        const httpStatus = findCodeByError(store.left);
        return replay.code(httpStatus).send({ message: store.left.message });
      }
      const object = {
        ...storeMapper.toObject(store.right.data),
        city: cityMapper.toObject(store.right.data.city),
        products: store.right.data.products.map(productMapper.toObject),
      };
      return replay.header('x-has-more', store.right.hasMore).send(object);
    },
  });
}

export default Product;
