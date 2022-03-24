import { Types } from '@/types'

function City() {
  function fromRecord(record: Types.Records.City) {
    const model: Types.Models.City = {
      id: record.id,
      name: record.name,
      initials: record.initials,
    }
    return model
  }

  function toObject(model: Types.Models.City) {
    const object: Types.Objects.City = {
      id: model.id,
      name: model.name,
      initials: model.initials,
    }
    return object
  }

  return {
    fromRecord,
    toObject,
  }
}

export { City }
