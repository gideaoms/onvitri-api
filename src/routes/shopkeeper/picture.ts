import path from 'path';
import fs from 'fs';
import os from 'os';
import stream from 'stream/promises';
import sharp from 'sharp';
import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { isLeft } from 'fp-either';
import { findCodeByError } from '@/utils';
import { TokenProvider } from '@/providers/token';
import { UserRepository } from '@/repositories/shopkeeper/user';
import { CryptoProvider } from '@/providers/crypto';
import { GuardianProvider } from '@/providers/guardian';
import { config } from '@/config';
import { Picture } from '@/types/picture';
import { PictureMapper } from '@/mappers/picture';
import { MultipartProvider } from '@/providers/multipart';

const userRepository = UserRepository();
const tokenProvider = TokenProvider();
const cryptoProvider = CryptoProvider();
const guardianProvider = GuardianProvider(tokenProvider, userRepository, cryptoProvider);
const multipartProvider = config.APP_ENV === 'production' ? undefined! : MultipartProvider();
const pictureMapper = PictureMapper();

async function Picture(fastify: FastifyInstance) {
  fastify.route({
    url: '/pictures',
    method: 'POST',
    async handler(request, replay) {
      const token = request.headers.authorization;
      const user = await guardianProvider.passThrough('shopkeeper', token);
      if (isLeft(user)) {
        const code = findCodeByError(user.left);
        return replay.code(code).send({ message: user.left.message });
      }
      const mdPictureName = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const mdPictureUrl = path.join(os.tmpdir(), mdPictureName);
      const transformer = sharp({ failOnError: false }).resize({ width: 1000, withoutEnlargement: true }).webp();
      const data = await request.file();
      await stream.pipeline(data.file, transformer, fs.createWriteStream(mdPictureUrl));
      const mdMetadata = await sharp(mdPictureUrl).metadata();
      const mdPicture: Picture = {
        id: crypto.randomUUID(),
        url: mdPictureUrl,
        name: mdPictureName,
        ext: mdMetadata.format!,
        width: mdMetadata.width!,
        height: mdMetadata.height!,
        size: 'md',
      };
      const uploadedMdPicture = await multipartProvider.create(mdPicture);
      const smPictureName = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const smPictureUrl = path.join(os.tmpdir(), smPictureName);
      await sharp(mdPicture.url, { failOnError: false })
        .resize({ width: 250, height: 250 })
        .webp()
        .toFile(smPictureUrl);
      const smMetadata = await sharp(smPictureUrl).metadata();
      const smPicture: Picture = {
        id: crypto.randomUUID(),
        url: smPictureUrl,
        name: smPictureName,
        ext: smMetadata.format!,
        width: smMetadata.width!,
        height: smMetadata.height!,
        size: 'sm',
      };
      const uploadedSmPicture = await multipartProvider.create(smPicture);
      const pictures = [pictureMapper.toObject(uploadedMdPicture), pictureMapper.toObject(uploadedSmPicture)];
      await fs.promises.unlink(mdPictureUrl);
      await fs.promises.unlink(smPictureUrl);
      return replay.send(pictures);
    },
  });
}

export default Picture;
