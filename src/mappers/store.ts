import { StoreRecord } from '@/types/records/store'
import { StoreModel } from '@/types/models/store'
import { StoreObject } from '@/types/objects/store'

function StoreMapper() {
  function fromRecord(record: StoreRecord) {
    const model: StoreModel = {
      id: record.id,
      fantasyName: record.fantasy_name,
      street: record.street,
      number: record.number,
      neighborhood: record.neighborhood,
      phone: {
        countryCode: record.phone.country_code,
        areaCode: record.phone.area_code,
        number: record.phone.number,
      },
      status: record.status,
    }
    return model
  }

  function toObject(model: StoreModel) {
    const object: StoreObject = {
      id: model.id,
      fantasy_name: model.fantasyName,
      street: model.street,
      number: model.number,
      neighborhood: model.neighborhood,
      phone: {
        country_code: model.phone.countryCode,
        area_code: model.phone.areaCode,
        number: model.phone.number,
      },
      status: model.status,
    }
    return object
  }

  return {
    fromRecord,
    toObject,
  }
}

export default StoreMapper
