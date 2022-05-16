import path from 'path'
import os from 'os'
import fs from 'fs'
import crypto from 'crypto'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import mimeTypes from 'mime-types'
import sharp from 'sharp'
import { MultipartProvider } from '@/types/providers/multipart'
import { Photo } from '@/types/photo'
import config from '@/config'

function MultipartS3Provider(): MultipartProvider {
  const s3 = new S3({
    endpoint: config.AWS_S3_ENDPOINT,
    region: 'sfo3',
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  })

  async function create(filename: string) {
    const from = path.resolve(os.tmpdir(), filename)
    const stream = fs.createReadStream(from)
    const contextType = mimeTypes.contentType(filename) as string
    const folder = format(new Date(), 'yyyy-MM-dd')
    await s3
      .putObject({
        Bucket: `onvitri/${folder}`,
        Key: filename,
        ACL: 'public-read',
        Body: stream,
        ContentType: contextType,
      })
      .promise()
    const resizeToThumbnail = sharp({ failOnError: false }).resize({
      width: 200,
      withoutEnlargement: true,
    })
    await s3
      .putObject({
        Bucket: `onvitri/${folder}/thumbnail`,
        Key: filename,
        ACL: 'public-read',
        Body: stream.pipe(resizeToThumbnail),
        ContentType: contextType,
      })
      .promise()
    await fs.promises.unlink(from)
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `https://onvitri.${config.AWS_S3_ENDPOINT}/${folder}/${filename}`,
      thumbnailUrl: `https://onvitri.${config.AWS_S3_ENDPOINT}/${folder}/thumbnail/${filename}`,
    }
    return photo
  }

  return {
    create,
  }
}

export default MultipartS3Provider
