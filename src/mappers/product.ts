import { Types } from '@/types'

function Product() {
  function fromRecord(record: Types.Records.Product) {
    const model: Types.Models.Product = {
      id: record.id,
      title: record.title,
      description: record.description,
      price: record.price,
      photos: record.photos,
      status: record.status,
    }
    return model
  }

  function toObject(model: Types.Models.Product) {
    const object: Types.Objects.Product = {
      id: model.id,
      title: model.title,
      description: model.description,
      price: model.price,
      photos: model.photos,
      status: model.status,
    }
    return object
  }

  return {
    fromRecord,
    toObject,
  }
}

export { Product }
