import os from 'os'
import path from 'path'
import fse from 'fs-extra'
import { MultipartProvider } from '@/types/providers/multipart'
import { Photo } from '@/types/photo'

function MultipartDiskProvider(): MultipartProvider {
  const tmp = path.resolve(__dirname, '..', '..', 'tmp')

  async function create(photo: Photo) {
    const from = path.resolve(os.tmpdir(), photo.url)
    const to = path.resolve(tmp, photo.url)
    await fse.move(from, to)
    const newPhoto: Photo = {
      url: photo.url,
    }
    return newPhoto
  }

  function destroy(photo: Photo) {
    const filepath = path.resolve(tmp, photo.url)
    return fse.remove(filepath)
  }

  return {
    create,
    destroy,
  }
}

export default MultipartDiskProvider
