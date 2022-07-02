import { Picture } from '@/types/picture';
import { PictureObject } from '@/types/objects/picture';

export function PictureMapper() {
  function toObject(picture: Picture) {
    const object: PictureObject = {
      id: picture.id,
      url: picture.url,
      ext: picture.ext,
      height: picture.height,
      name: picture.name,
      size: picture.size,
      width: picture.width,
    };
    return object;
  }

  function fromObject(object: PictureObject) {
    const picture: Picture = {
      id: object.id,
      url: object.url,
      ext: object.ext,
      height: object.height,
      name: object.name,
      size: object.size,
      width: object.width,
    };
    return picture;
  }

  return {
    toObject: toObject,
    fromObject: fromObject,
  };
}
