import { ProductRecord } from '@/types/records/product';
import { Product } from '@/types/product';
import { ProductObject } from '@/types/objects/product';
import { PictureMapper } from '@/mappers/picture';

export function ProductMapper() {
  const pictureMapper = PictureMapper();

  function fromRecord(record: ProductRecord) {
    const product: Product = {
      id: record.id,
      storeId: record.store_id,
      title: record.title,
      description: record.description,
      price: record.price,
      status: record.status,
      pictures: record.pictures.map(pictureMapper.fromObject),
    };
    return product;
  }

  function toObject(product: Product) {
    const object: ProductObject = {
      id: product.id,
      store_id: product.storeId,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      pictures: product.pictures.map(pictureMapper.toObject),
    };
    return object;
  }

  function toRecord(product: Product) {
    const record: ProductRecord = {
      id: product.id,
      store_id: product.storeId,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      pictures: product.pictures.map(pictureMapper.toRecord),
    };
    return record;
  }

  return {
    fromRecord: fromRecord,
    toObject: toObject,
    toRecord: toRecord,
  };
}
