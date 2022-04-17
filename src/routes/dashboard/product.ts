import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { findHttpStatusByError } from '@/utils/exception'
import UserRepository from '@/repositories/user'
import ProductRepository from '@/repositories/dashboard/product'
import CryptoProvider from '@/providers/crypto'
import TokenProvider from '@/providers/token'
import GuardianProvider from '@/providers/guardian'
import ProductMapper from '@/mappers/product'
import StoreMapper from '@/mappers/store'
import CityMapper from '@/mappers/city'
import ProductService from '@/services/dashboard/product'
import StoreRepository from '@/repositories/dashboard/store'

const userRepository = UserRepository()
const productRepository = ProductRepository()
const storeRepository = StoreRepository()
const cryptoProvider = CryptoProvider()
const tokenProvider = TokenProvider()
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider)
const productMapper = ProductMapper()
const storeMapper = StoreMapper()
const cityMapper = CityMapper()
const productService = ProductService(guardianProvider, productRepository, storeRepository)

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
        const httpStatus = findHttpStatusByError(products.left)
        return replay.code(httpStatus).send({ message: products.left.message })
      }
      const object = products.right.data.map((product) => ({
        ...productMapper.toObject(product),
        store: {
          ...storeMapper.toObject(product.store),
          city: cityMapper.toObject(product.store.city),
        },
      }))
      return replay.header('x-has-more', products.right.hasMore).send(object)
    },
  })
}

export default Product
