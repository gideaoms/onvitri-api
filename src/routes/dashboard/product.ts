import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { findCodeByError, getBy } from '@/utils'
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
import { Product } from '@/types/product'

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
      const page = getBy(request.query, 'page')
      const token = request.headers.authorization
      const products = await productService.findMany(page, token)
      if (isLeft(products)) {
        const httpStatus = findCodeByError(products.left)
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

  fastify.route({
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
          },
          description: {
            type: 'string',
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
              },
            },
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
          },
        },
        required: ['store_id', 'title', 'description', 'price', 'photos'],
      },
      response: {
        200: {
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
                },
              },
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const { store_id: storeId, title, description, price, photos, status } = request.body as any
      const product = await productService.create(storeId, title, description, price, photos, status, token)
      if (isLeft(product)) {
        const httpStatus = findCodeByError(product.left)
        return replay.code(httpStatus).send({ message: product.left.message })
      }
      const object = productMapper.toObject(product.right)
      return replay.send(object)
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
    async handler(request, replay) {
      const productId = getBy(request.params, 'product_id')
      const token = request.headers.authorization
      const product = await productService.findOne(productId, token)
      if (isLeft(product)) {
        const httpStatus = findCodeByError(product.left)
        return replay.code(httpStatus).send({ message: product.left.message })
      }
      const object = {
        ...productMapper.toObject(product.right),
        store: {
          ...storeMapper.toObject(product.right.store),
          city: cityMapper.toObject(product.right.store.city),
        },
      }
      return replay.send(object)
    },
  })

  fastify.route({
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
          },
          description: {
            type: 'string',
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
    },
    async handler(request, replay) {
      const productId = getBy(request.params, 'product_id')
      const title = getBy(request.body, 'title')
      const description = getBy(request.body, 'description')
      const price = getBy(request.body, 'price')
      const photos = getBy(request.body, 'photos')
      const status = getBy(request.body, 'status')
      const token = request.headers.authorization
      const updated = await productService.update(productId, title, description, price, photos, status, token)
      if (isLeft(updated)) {
        const code = findCodeByError(updated.left)
        return replay.code(code).send({ message: updated.left.message })
      }
      const object = productMapper.toObject(updated.right)
      return replay.send(object)
    },
  })

  fastify.route({
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
      const productId = getBy(request.params, 'product_id')
      const token = request.headers.authorization
      const destroyed = await productService.destroy(productId, token)
      if (isLeft(destroyed)) {
        const code = findCodeByError(destroyed.left)
        return replay.code(code).send({ message: destroyed.left.message })
      }
      return replay.send()
    },
  })
}

export default Product
