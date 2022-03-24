import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { Services } from '@/services'
import { Repositories } from '@/repositories'
import { Mappers } from '@/mappers'
import { Exception } from '@/utils/exception'

const productRepository = Repositories.Product()
const storeRepository = Repositories.Store()
const productService = Services.Product(productRepository, storeRepository)
const productMapper = Mappers.Product()
const storeMapper = Mappers.Store()
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
                },
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const page = (request.query as any).page
      const storeId = (request.query as any).store_id
      if (storeId) {
        const products = await productService.findManyByStore(storeId, page)
        if (isLeft(products)) {
          const code = exception.findCodeByError(products.left)
          return replay.code(code).send({ message: products.left.message })
        }
        const object = products.right.data.map(productMapper.toObject)
        return replay.header('x-has-more', products.right.hasMore).send(object)
      }
      const { data: products, hasMore } = await productService.findMany(page)
      const object = products.map((product) => ({
        ...productMapper.toObject(product),
        store: storeMapper.toObject(product.store),
      }))
      return replay.header('x-has-more', hasMore).send(object)
    },
  })

  fastify.route({
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
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const productId = (request.params as any).product_id
      const product = await productService.findOne(productId)
      if (isLeft(product)) {
        const code = exception.findCodeByError(product.left)
        return replay.code(code).send({ message: product.left.message })
      }
      const object = {
        ...productMapper.toObject(product.right),
        store: storeMapper.toObject(product.right.store),
      }
      return replay.send(object)
    },
  })
}

export default Product
