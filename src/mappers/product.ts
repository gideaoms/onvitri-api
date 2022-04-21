import { ProductRecord } from '@/types/records/product'
import { Product } from '@/types/product'
import { ProductObject } from '@/types/objects/product'

function ProductMapper() {
  function fromRecord(record: ProductRecord) {
    const product: Product = {
      id: record.id,
      storeId: record.store_id,
      title: record.title,
      description: record.description,
      price: record.price,
      status: record.status,
      photos: record.photos,
    }
    return product
  }

  function toObject(product: Product) {
    const object: ProductObject = {
      id: product.id,
      store_id: product.storeId,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      photos: product.photos,
    }
    return object
  }

  function toRecord(product: Product) {
    const record: ProductRecord = {
      id: product.id,
      store_id: product.storeId,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      photos: product.photos,
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
