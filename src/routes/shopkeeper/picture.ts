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
      const transformer = sharp({ failOnError: false }).resize({ width: 1000, withoutEnlargement: true }).webp();
      const data = await request.file();
      const pictureName1 = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const pictureUrl1 = path.join(os.tmpdir(), pictureName1);
      await stream.pipeline(data.file, transformer, fs.createWriteStream(pictureUrl1));
      const metadata1 = await sharp(pictureUrl1).metadata();
      const picture1: Picture = {
        id: crypto.randomUUID(),
        url: pictureUrl1,
        name: pictureName1,
        ext: metadata1.format!,
        width: metadata1.width!,
        height: metadata1.height!,
        size: 'md',
      };
      const uploadedPicture1 = await multipartProvider.create(picture1);
      const pictureName2 = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const pictureUrl2 = path.join(os.tmpdir(), pictureName2);
      await sharp(picture1.url, { failOnError: false }).resize({ width: 250, height: 250 }).webp().toFile(pictureUrl2);
      const metadata2 = await sharp(pictureUrl2).metadata();
      const picture2: Picture = {
        id: crypto.randomUUID(),
        url: pictureUrl2,
        name: pictureName2,
        ext: metadata2.format!,
        width: metadata2.width!,
        height: metadata2.height!,
        size: 'sm',
      };
      const uploadedPicture2 = await multipartProvider.create(picture2);
      const pictures = [pictureMapper.toObject(uploadedPicture1), pictureMapper.toObject(uploadedPicture2)];
      await fs.promises.unlink(pictureUrl1);
      await fs.promises.unlink(pictureUrl2);
      return replay.send(pictures);
    },
  });
}

export default Picture;
