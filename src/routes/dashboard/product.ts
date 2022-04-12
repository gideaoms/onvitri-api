import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { Services } from '@/services'
import { Repositories } from '@/repositories'
import { Mappers } from '@/mappers'
import { Exception } from '@/utils/exception'
import { Providers } from '@/providers'

const userRepository = Repositories.User()
const storeRepository = Repositories.Dashboard.Store()
const productRepository = Repositories.Dashboard.Product()
const cryptoProvider = Providers.Crypto()
const tokenProvider = Providers.Token()
const guardianProvider = Providers.Guardian(tokenProvider, userRepository, cryptoProvider)
const productMapper = Mappers.Product()
const storeMapper = Mappers.Store()
const cityMapper = Mappers.City()
const productService = Services.Dashboard.Product(
  guardianProvider,
  storeRepository,
  productRepository,
)
const exception = Exception()

async function Product(fastify: FastifyInstance) {
  fastify.route({
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
              store_id: {
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
                      area: {
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
                },
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const page = (request.query as any).page
      const token = request.headers.authorization
      const products = await productService.findMany(page, token)
      if (isLeft(products)) {
        const code = exception.findCodeByError(products.left)
        return replay.code(code).send({ message: products.left.message })
      }
      const object = products.right.data.map((product) => ({
        ...productMapper.toObject(product),
        store: {
          ...storeMapper.toObject(product.store),
          city: cityMapper.toObject(product.store.city),
        },
      }))
      return replay.send(object)
    },
  })
}

export default Product
