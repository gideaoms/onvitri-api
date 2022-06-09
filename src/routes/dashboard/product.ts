import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { Product } from '@/types/product';
import { ProductObject } from '@/types/objects/product';
import { ProductRepository } from '@/repositories/dashboard/product';
import { ProductService } from '@/services/dashboard/product';
import { UserRepository } from '@/repositories/user';
import { CryptoProvider } from '@/providers/crypto';
import { TokenProvider } from '@/providers/token';
import { GuardianProvider } from '@/providers/guardian';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { PhotoMapper } from '@/mappers/photo';
import { StoreRepository } from '@/repositories/dashboard/store';

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
const productService = ProductService(guardianProvider, productRepository, storeRepository);

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
      const page = request.query.page;
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isLeft(user)) {
        const httpStatus = findCodeByError(user.left);
        return replay.code(httpStatus).send({ message: user.left.message });
      }
      const products = await productService.findMany(page, user.right);
      const object = products.data.map((product) => ({
        ...productMapper.toObject(product),
        store: {
          ...storeMapper.toObject(product.store),
          city: cityMapper.toObject(product.store.city),
        },
      }));
      return replay.header('x-has-more', products.hasMore).send(object);
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
      const object = productMapper.toObject(product.right);
      return replay.send(object);
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
      const object = {
        ...productMapper.toObject(product.right),
        store: {
          ...storeMapper.toObject(product.right.store),
          city: cityMapper.toObject(product.right.store.city),
        },
      };
      return replay.send(object);
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
      const object = productMapper.toObject(updated.right);
      return replay.send(object);
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
      const destroyed = await productService.destroy(productId, user.right);
      if (isLeft(destroyed)) {
        const code = findCodeByError(destroyed.left);
        return replay.code(code).send({ message: destroyed.left.message });
      }
      return replay.send();
    },
  });
}

export default Product;
