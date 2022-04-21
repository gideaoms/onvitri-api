import { ProductRecord } from '@/types/records/product'
import { Product } from '@/types/product'
import { ProductObject } from '@/types/objects/product'

function ProductMapper() {
  function fromRecord(record: ProductRecord) {
    const model: Product = {
      id: record.id,
      storeId: record.store_id,
      title: record.title,
      description: record.description,
      price: record.price,
      photos: record.photos,
      status: record.status,
    }
    return model
  }

  function toObject(model: Product) {
    const object: ProductObject = {
      id: model.id,
      store_id: model.storeId,
      title: model.title,
      description: model.description,
      price: model.price,
      photos: model.photos,
      status: model.status,
    }
    return object
  }

  function toRecord(model: Product) {
    const record: ProductRecord = {
      id: model.id,
      store_id: model.storeId,
      title: model.title,
      description: model.description,
      price: model.price,
      status: model.status,
      photos: model.photos,
    }
    return record
  }

  return {
    fromRecord,
    toObject,
    toRecord,
  }
}

export default ProductMapper
