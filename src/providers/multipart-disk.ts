import os from 'os'
import crypto from 'crypto'
import path from 'path'
import fse from 'fs-extra'
import { MultipartProvider } from '@/types/providers/multipart'
import { Photo } from '@/types/photo'
import config from '@/config'

function MultipartDiskProvider(): MultipartProvider {
  const tmp = path.resolve(__dirname, '..', '..', 'tmp')

  async function create(filename: string) {
    const from = path.resolve(os.tmpdir(), filename)
    await fse.copy(from, path.resolve(tmp, filename))
    await fse.move(from, path.resolve(tmp, 'thumbnail', filename))
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: `http://localhost:${config.APP_PORT}/photos/${filename}`,
      thumbnailUrl: `http://localhost:${config.APP_PORT}/photos/thumbnail/${filename}`,
    }
    return photo
  }

  return {
    create,
  }
}

export default MultipartDiskProvider
