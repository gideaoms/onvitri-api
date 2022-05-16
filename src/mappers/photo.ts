import { Photo } from '@/types/photo'
import { PhotoObject } from '@/types/objects/photo'

function PhotoMapper() {
  function toObject(photo: Photo) {
    const object: PhotoObject = {
      id: photo.id,
      url: photo.url,
      thumbnail_url: photo.thumbnailUrl,
    }
    return object
  }

  return {
    toObject,
  }
}

export default PhotoMapper
