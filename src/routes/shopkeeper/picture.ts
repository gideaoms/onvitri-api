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
      if (isFailure(user)) {
        const code = findHttpStatusByError(user.failure);
        return replay.code(code).send({ message: user.failure.message });
      }
      const transformer = sharp({ failOnError: false }).resize({ width: 1000, withoutEnlargement: true }).webp();
      const data = await request.file();
      const pictureNameMD = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const pictureUrlMD = path.join(os.tmpdir(), pictureNameMD);
      await stream.pipeline(data.file, transformer, fs.createWriteStream(pictureUrlMD));
      const metadataMD = await sharp(pictureUrlMD).metadata();
      const pictureNameSM = `${crypto.randomBytes(30).toString('hex')}.webp`;
      const pictureUrlSM = path.join(os.tmpdir(), pictureNameSM);
      await sharp(pictureUrlMD, { failOnError: false }).resize({ width: 250, height: 250 }).webp().toFile(pictureUrlSM);
      const metadataSM = await sharp(pictureUrlSM).metadata();
      const picture: Picture = {
        id: crypto.randomUUID(),
        variants: [
          {
            size: 'md',
            name: pictureNameMD,
            url: pictureUrlMD,
            ext: metadataMD.format!,
            width: metadataMD.width!,
            height: metadataMD.height!,
          },
          {
            size: 'sm',
            name: pictureNameSM,
            url: pictureUrlSM,
            ext: metadataSM.format!,
            width: metadataSM.width!,
            height: metadataSM.height!,
          },
        ],
      };
      const result = await multipartProvider.create(picture);
      await fs.promises.unlink(pictureUrlMD);
      await fs.promises.unlink(pictureUrlSM);
      return replay.send(pictureMapper.toObject(result));
    },
  });
}

export default Picture;
