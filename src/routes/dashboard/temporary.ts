import { FastifyInstance } from 'fastify'
import cron from 'node-cron'
import os from 'os'
import path from 'path'
import stream from 'stream/promises'
import crypto from 'crypto'
import fs from 'fs'
import sharp from 'sharp'
import mimeTypes from 'mime-types'
import { isLeft } from 'fp-either'
import TemporaryService from '@/services/dashboard/temporary'
import TemporaryRepository from '@/repositories/dashboard/temporary'
import ProductRepository from '@/repositories/dashboard/product'
import UserRepository from '@/repositories/user'
import TimeProvider from '@/providers/time'
import CryptoProvider from '@/providers/crypto'
import TokenProvider from '@/providers/token'
import GuardianProvider from '@/providers/guardian'
import MultipartDiskProvider from '@/providers/multipart-disk'
import TemporaryMapper from '@/mappers/temporary'
import { findCodeByError, getBy } from '@/utils'

const userRepository = UserRepository()
const cryptoProvider = CryptoProvider()
const tokenProvider = TokenProvider()
const guardianProvider = GuardianProvider(
  tokenProvider,
  userRepository,
  cryptoProvider,
)
const productRepository = ProductRepository()
const temporaryMapper = TemporaryMapper()
const timeProvider = TimeProvider()
const multipartDiskProvider = MultipartDiskProvider()
const temporaryRepository = TemporaryRepository(timeProvider)
const temporaryService = TemporaryService(
  guardianProvider,
  temporaryRepository,
  productRepository,
  multipartDiskProvider,
)

const daily = '0 1 * * *'
cron.schedule(daily, async () => {
  await temporaryService.destroyMany()
})

async function Temporary(fastify: FastifyInstance) {
  fastify.route({
    url: '/products/:product_id/temporaries',
    method: 'POST',
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
      const token = request.headers.authorization
      const productId = getBy(request.params, 'product_id')
      const allowed = ['image/png', 'image/jpg', 'image/jpeg']
      const photoMaxWidth = 1000
      const resizePhoto = sharp({ failOnError: false }).resize({
        width: photoMaxWidth,
        withoutEnlargement: true,
      })
      const file = await request.file()
      if (!allowed.includes(file.mimetype)) {
        return replay.code(400).send({ message: 'Tipo de imagem inválido' })
      }
      const randomized = crypto.randomBytes(30).toString('hex')
      const ext = mimeTypes.extension(file.mimetype) || 'jpeg'
      const filename = `${randomized}.${ext}`
      const url = path.join(os.tmpdir(), filename)
      await stream.pipeline(
        file.file.pipe(resizePhoto),
        fs.createWriteStream(url),
      )
      const temporary = await temporaryService.create(
        productId,
        filename,
        token,
      )
      if (isLeft(temporary)) {
        const httpStatus = findCodeByError(temporary.left)
        return replay.code(httpStatus).send({ message: temporary.left.message })
      }
      const object = temporaryMapper.toObject(temporary.right)
      return replay.send(object)
    },
  })
}

export default Temporary
