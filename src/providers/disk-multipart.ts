import os from 'os'
import crypto from 'crypto'
import path from 'path'
import fse from 'fs-extra'
import { MultipartProvider } from '@/types/providers/multipart'
import { Photo } from '@/types/photo'
import { APP_PORT } from '@/settings/app'

function DiskMultipartProvider(): MultipartProvider {
  const tmp = path.resolve(__dirname, '..', '..', 'tmp')

  async function create(filename: string) {
    const from = path.resolve(os.tmpdir(), filename)
    const to = path.resolve(tmp, filename)
    await fse.move(from, to)
    const url = `http://localhost:${APP_PORT}/photos/${filename}`
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      url: url,
    }
    return newPhoto
  }

  return {
    create,
  }
}

export default DiskMultipartProvider
