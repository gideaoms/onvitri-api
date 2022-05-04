import path from 'path'
import os from 'os'
import fs from 'fs'
import crypto from 'crypto'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import mimeTypes from 'mime-types'
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
    await fs.promises.unlink(from)
    // https://onvitri.sfo3.digitaloceanspaces.com/2022-05-04/7a21b83b36523dc1c796549da106fba120e2336a219b03970b18d472e012.jpeg
    // https://onvitri.sfo3.digitaloceanspaces.com/2022-05-04/a2b557e9e85b8b4f6158025c650ea89676c28b1584d66ea7af971d9dc315.jpeg
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `https://onvitri.${config.AWS_S3_ENDPOINT}/${folder}/${filename}`,
    }
    return photo
  }

  return {
    create,
  }
}

export default MultipartS3Provider
