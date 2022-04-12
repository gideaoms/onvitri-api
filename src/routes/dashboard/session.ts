import { FastifyInstance } from 'fastify'
import { isLeft } from 'fp-either'
import { Services } from '@/services'
import { Repositories } from '@/repositories'
import { Mappers } from '@/mappers'
import { Exception } from '@/utils/exception'
import { Providers } from '@/providers'

const userRepository = Repositories.User()
const cryptoProvider = Providers.Crypto()
const tokenProvider = Providers.Token()
const guardianProvider = Providers.Guardian(tokenProvider, userRepository, cryptoProvider)
const userMapper = Mappers.User()
const sessionService = Services.Dashboard.Session(
  userRepository,
  cryptoProvider,
  tokenProvider,
  guardianProvider,
)
const exception = Exception()

async function Session(fastify: FastifyInstance) {
  fastify.route({
    url: '/sessions',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
        required: ['email', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            roles: {
              type: 'array',
              format: 'string',
            },
            status: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const email = (request.body as any).email
      const password = (request.body as any).password
      const session = await sessionService.create(email, password)
      if (isLeft(session)) {
        const code = exception.findCodeByError(session.left)
        return replay.code(code).send({ message: session.left.message })
      }
      const object = userMapper.toObject(session.right)
      return replay.send(object)
    },
  })

  fastify.route({
    url: '/sessions',
    method: 'GET',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            roles: {
              type: 'array',
              format: 'string',
            },
            status: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(request, replay) {
      const token = request.headers.authorization
      const session = await sessionService.findOne(token)
      if (isLeft(session)) {
        const code = exception.findCodeByError(session.left)
        return replay.code(code).send({ message: session.left.message })
      }
      const object = userMapper.toObject(session.right)
      return replay.send(object)
    },
  })
}

export default Session
