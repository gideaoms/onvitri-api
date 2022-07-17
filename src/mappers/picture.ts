import { Picture } from '@/types/picture';
import { PictureObject } from '@/types/objects/picture';
import { PictureRecord } from '@/types/records/picture';

export function PictureMapper() {
  function toObject(picture: Picture) {
    const object: PictureObject = {
      id: picture.id,
      variants: picture.variants.map((variant) => ({
        url: variant.url,
        ext: variant.ext,
        height: variant.height,
        name: variant.name,
        size: variant.size,
        width: variant.width,
      })),
    };
    return object;
  }

  function fromObject(object: PictureObject) {
    const picture: Picture = {
      id: object.id,
      variants: object.variants.map((variant) => ({
        url: variant.url,
        ext: variant.ext,
        height: variant.height,
        name: variant.name,
        size: variant.size,
        width: variant.width,
      })),
    };
    return picture;
  }

  function toRecord(picture: Picture) {
    const record: PictureRecord = {
      id: picture.id,
      variants: picture.variants.map((variant) => ({
        url: variant.url,
        ext: variant.ext,
        height: variant.height,
        name: variant.name,
        size: variant.size,
        width: variant.width,
      })),
    };
    return record;
  }

  return {
    toObject: toObject,
    fromObject: fromObject,
    toRecord: toRecord,
  };
}
