import path from 'path';
import fs from 'fs';
import os from 'os';
import stream from 'stream/promises';
import sharp from 'sharp';
import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { isFailure } from '@/either';
import { findHttpStatusByError } from '@/utils';
import { TokenProvider } from '@/providers/token';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { CryptoProvider } from '@/providers/crypto';
import { GuardianProvider } from '@/providers/guardian';
import { Picture } from '@/types/picture';
import { PictureMapper } from '@/mappers/picture';
import { MultipartProvider } from '@/providers/multipart';

const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const cryptoProvider = CryptoProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const multipartProvider = MultipartProvider();
const pictureMapper = PictureMapper();

export default async function Picture(fastify: FastifyInstance) {
  fastify.route({
    url: '/pictures',
    method: 'POST',
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isFailure(user)) {
        const httpStatus = findHttpStatusByError(user.failure);
        return replay.code(httpStatus).send({ message: user.failure.message });
      }
      const transformer = sharp({ failOnError: false })
        .resize({ width: 800, withoutEnlargement: true })
        .webp();
      const data = await request.file();
      const mdPictureName = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const mdPictureUrl = path.join(os.tmpdir(), mdPictureName);
      await stream.pipeline(data.file, transformer, fs.createWriteStream(mdPictureUrl));
      const mdMetadata = await sharp(mdPictureUrl).metadata();
      const smPictureName = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const smPictureUrl = path.join(os.tmpdir(), smPictureName);
      await sharp(mdPictureUrl, { failOnError: false })
        .resize({ width: 150, height: 150 })
        .webp()
        .toFile(smPictureUrl);
      const smMetadata = await sharp(smPictureUrl).metadata();
      const picture: Picture = {
        id: crypto.randomUUID(),
        variants: [
          {
            size: 'md',
            name: mdPictureName,
            url: mdPictureUrl,
            ext: mdMetadata.format!,
            width: mdMetadata.width!,
            height: mdMetadata.height!,
          },
          {
            size: 'sm',
            name: smPictureName,
            url: smPictureUrl,
            ext: smMetadata.format!,
            width: smMetadata.width!,
            height: smMetadata.height!,
          },
        ],
      };
      const result = await multipartProvider.create(picture);
      await fs.promises.unlink(mdPictureUrl);
      await fs.promises.unlink(smPictureUrl);
      return replay.send(pictureMapper.toObject(result));
    },
  });
}
