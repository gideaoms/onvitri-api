import { CityObject } from '@/types/objects/city'
import { CityModel } from '@/types/models/city'
import { CityRecord } from '@/types/records/city'

function CityMapper() {
  function fromRecord(record: CityRecord) {
    const model: CityModel = {
      id: record.id,
      name: record.name,
      initials: record.initials,
    }
    return model
  }

  function toObject(model: CityModel) {
    const object: CityObject = {
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

export default CityMapper
