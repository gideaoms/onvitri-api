import fs from 'fs';
import format from 'date-fns/format';
import { S3 } from 'aws-sdk';
import { MultipartProvider } from '@/types/providers/multipart';
import { config } from '@/config';
import { Picture } from '@/types/picture';

export function MultipartProvider(): MultipartProvider {
  const s3 = new S3({
    endpoint: config.AWS_S3_ENDPOINT,
    region: 'sfo3',
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  async function create(picture: Picture) {
    const folder = format(new Date(), 'yyyy-MM-dd');
    await s3
      .putObject({
        Bucket: `${config.AWS_S3_NAME}/${folder}`,
        Key: picture.name,
        ACL: 'public-read',
        Body: fs.createReadStream(picture.url),
        ContentType: 'image/webp',
      })
      .promise();
    const newPicture: Picture = {
      ...picture,
      url: `https://${config.AWS_S3_NAME}.${config.AWS_S3_ENDPOINT}/${folder}/${picture.name}`,
    };
    return newPicture;
  }

  return {
    create: create,
  };
}
