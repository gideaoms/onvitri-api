import os from 'os';
import crypto from 'crypto';
import path from 'path';
import fse from 'fs-extra';
import { IMultipartProvider } from '@/types/providers/multipart';
import { Photo } from '@/types/photo';
import config from '@/config';

function MultipartDiskProvider(): IMultipartProvider {
  const appTmpSrc = path.resolve(__dirname, '..', '..', 'tmp');

  async function create(photoName: string) {
    const osTmpSrc = os.tmpdir();
    const tmpPhotoSrc = path.join(osTmpSrc, photoName);
    const thumbPhotoSrc = path.join(osTmpSrc, 'thumbs', photoName);
    await fse.move(tmpPhotoSrc, path.join(appTmpSrc, photoName));
    await fse.move(thumbPhotoSrc, path.join(appTmpSrc, 'thumbs', photoName));
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `http://localhost:${config.APP_PORT}/photos/${photoName}`,
      thumbnailUrl: `http://localhost:${config.APP_PORT}/photos/thumbs/${photoName}`,
    };
    return photo;
  }

  return {
    create,
  };
}

export default MultipartDiskProvider;
