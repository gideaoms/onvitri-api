import os from 'os';
import crypto from 'crypto';
import path from 'path';
import fse from 'fs-extra';
import { MultipartProvider } from '@/types/providers/multipart';
import { Photo } from '@/types/photo';
import config from '@/config';

export function MultipartDiskProvider(): MultipartProvider {
  async function create(photoName: string) {
    const tmpPhotoSrc = path.resolve(os.tmpdir(), photoName);
    const thumbPhotoSrc = path.resolve(os.tmpdir(), 'thumbs', photoName);
    await fse.move(tmpPhotoSrc, path.resolve(MultipartDiskProvider.FOLDER, photoName));
    await fse.move(thumbPhotoSrc, path.resolve(MultipartDiskProvider.FOLDER, 'thumbs', photoName));
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `http://localhost:${config.APP_PORT}/photos/${photoName}`,
      thumbnailUrl: `http://localhost:${config.APP_PORT}/photos/thumbs/${photoName}`,
    };
    return photo;
  }

  return {
    create: create,
  };
}

MultipartDiskProvider.FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
