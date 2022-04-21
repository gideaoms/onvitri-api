import { MultipartProvider } from '@/types/providers/multipart'
import { Photo } from '@/types/photo'

function MultipartCloudProvider(): MultipartProvider {
  async function create() {
    // destroy photo from disk after uploading it to cloud
    return {} as Photo
  }

  return {
    create,
  }
}

export default MultipartCloudProvider
