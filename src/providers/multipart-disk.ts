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
    const to = path.resolve(tmp, filename)
    await fse.move(from, to)
    const url = `http://localhost:${config.APP_PORT}/photos/${filename}`
    const photo: Photo = {
      id: crypto.randomUUID(),
      url: url,
    }
    return photo
  }

  return {
    create,
  }
}

export default MultipartDiskProvider
