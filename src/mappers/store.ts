import { Types } from '@/types'

function Store() {
  function fromRecord(record: Types.Records.Store) {
    const model: Types.Models.Store = {
      id: record.id,
      fantasyName: record.fantasy_name,
      street: record.street,
      number: record.number,
      neighborhood: record.neighborhood,
      phone: {
        countryCode: record.phone.country_code,
        area: record.phone.area,
        number: record.phone.number,
      },
      status: record.status,
    }
    return model
  }

  function toObject(model: Types.Models.Store) {
    const object: Types.Objects.Store = {
      id: model.id,
      fantasy_name: model.fantasyName,
      street: model.street,
      number: model.number,
      neighborhood: model.neighborhood,
      phone: {
        country_code: model.phone.countryCode,
        area: model.phone.area,
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

export { Store }
