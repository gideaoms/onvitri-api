import { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs'
import os from 'os'
import stream from 'stream/promises'
import sharp from 'sharp'
import crypto from 'crypto'
import { isLeft } from 'fp-either'
import { findCodeByError } from '@/utils'
import TokenProvider from '@/providers/token'
import UserRepository from '@/repositories/user'
import CryptoProvider from '@/providers/crypto'
import GuardianProvider from '@/providers/guardian'
import MultipartDiskProvider from '@/providers/multipart-disk'
import MultipartS3Provider from '@/providers/multipart-s3'
import PhotoService from '@/services/dashboard/photo'
import PhotoMapper from '@/mappers/photo'
import config from '@/config'

const userRepository = UserRepository()
const tokenProvider = TokenProvider()
const cryptoProvider = CryptoProvider()
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider)
const multipartProvider = config.APP_ENV === 'production' ? MultipartS3Provider() : MultipartDiskProvider()
const photoMapper = PhotoMapper()
const photoService = PhotoService(guardianProvider, multipartProvider)

async function Photo(fastify: FastifyInstance) {
  fastify.route({
    url: '/photos',
    method: 'POST',
    async handler(request, replay) {
      const token = request.headers.authorization
      const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
      const data = await request.file()
      if (!allowed.includes(data.mimetype)) return replay.code(400).send({ message: 'Tipo de image não permitido.' })
      const photoName = `${crypto.randomBytes(30).toString('hex')}.webp`
      const tmpDir = os.tmpdir()
      const tmpPhotoSrc = path.join(tmpDir, photoName)
      const tmpThumbsDir = path.join(tmpDir, 'thumbs')
      if (!fs.existsSync(tmpThumbsDir)) await fs.promises.mkdir(tmpThumbsDir)
      const thumbPhotoSrc = path.join(tmpThumbsDir, photoName)
      const transformer = sharp({ failOnError: false }).resize({ width: 1000, withoutEnlargement: true }).webp()
      await stream.pipeline(data.file, transformer, fs.createWriteStream(tmpPhotoSrc))
      await sharp(tmpPhotoSrc, { failOnError: false }).resize({ width: 200, height: 200 }).webp().toFile(thumbPhotoSrc)
      const photo = await photoService.create(photoName, token)
      if (isLeft(photo)) {
        const code = findCodeByError(photo.left)
        return replay.code(code).send({ message: photo.left.message })
      }
      const object = photoMapper.toObject(photo.right)
      return replay.send(object)
    },
  })
}

export default Photo
