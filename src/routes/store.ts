import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { Services } from '@/services'
import { Repositories } from '@/repositories'
import { Mappers } from '@/mappers'
import { Exception } from '@/utils/exception'

const storeRepository = Repositories.Store()
const storeService = Services.Store(storeRepository)
const storeMapper = Mappers.Store()
const productMapper = Mappers.Product()
const cityMapper = Mappers.City()
const exception = Exception()

async function Product(fastify: FastifyInstance) {
  fastify.route({
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
                area: {
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
                    type: 'number',
                  },
                  status: {
                    type: 'string',
                  },
                  photos: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: {
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
      const storeId = (request.params as any).store_id
      const store = await storeService.findOne(storeId)
      if (isLeft(store)) {
        const code = exception.findCodeByError(store.left)
        return replay.code(code).send({ message: store.left.message })
      }
      const object = {
        ...storeMapper.toObject(store.right.data),
        city: cityMapper.toObject(store.right.data.city),
        products: store.right.data.products.map(productMapper.toObject),
      }
      return replay.header('x-has-more', store.right.hasMore).send(object)
    },
  })
}

export default Product
