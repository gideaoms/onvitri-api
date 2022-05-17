import { Photo } from '@/types/photo';
import { PhotoObject } from '@/types/objects/photo';

function PhotoMapper() {
  function toObject(photo: Photo) {
    const object: PhotoObject = {
      id: photo.id,
      url: photo.url,
      thumbnail_url: photo.thumbnailUrl,
    };
    return object;
  }

  function fromObject(object: PhotoObject) {
    const photo: Photo = {
      id: object.id,
      url: object.url,
      thumbnailUrl: object.thumbnail_url,
    };
    return photo;
  }

  return {
    toObject,
    fromObject,
  };
}

export default PhotoMapper;
