import path from 'path';
import os from 'os';
import fs from 'fs';
import crypto from 'crypto';
import { S3 } from 'aws-sdk';
import format from 'date-fns/format';
import { MultipartProvider } from '@/types/providers/multipart';
import { Photo } from '@/types/photo';
import config from '@/config';

function MultipartS3Provider(): MultipartProvider {
  const s3 = new S3({
    endpoint: config.AWS_S3_ENDPOINT,
    region: 'sfo3',
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  async function create(photoName: string) {
    const tmpPhotoSrc = path.join(os.tmpdir(), photoName);
    const thumbPhotoSrc = path.join(os.tmpdir(), 'thumbs', photoName);
    const folder = format(new Date(), 'yyyy-MM-dd');
    await s3
      .putObject({
        Bucket: `onvitri/${folder}`,
        Key: photoName,
        ACL: 'public-read',
        Body: fs.createReadStream(tmpPhotoSrc),
        ContentType: 'image/webp',
      })
      .promise();
    await s3
      .putObject({
        Bucket: `onvitri/${folder}/thumbs`,
        Key: photoName,
        ACL: 'public-read',
        Body: fs.createReadStream(thumbPhotoSrc),
        ContentType: 'image/webp',
      })
      .promise();
    await fs.promises.unlink(tmpPhotoSrc);
    await fs.promises.unlink(thumbPhotoSrc);
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `https://onvitri.${config.AWS_S3_ENDPOINT}/${folder}/${photoName}`,
      thumbnailUrl: `https://onvitri.${config.AWS_S3_ENDPOINT}/${folder}/thumbs/${photoName}`,
    };
    return photo;
  }

  return {
    create,
  };
}

export default MultipartS3Provider;
