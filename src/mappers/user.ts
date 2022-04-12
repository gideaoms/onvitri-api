import { Types } from '@/types'

function User() {
  function fromRecord(record: Types.Records.User) {
    const model: Types.Models.User = {
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      roles: record.roles,
      status: record.status,
      token: record.token,
    }
    return model
  }

  function toObject(model: Types.Models.User) {
    const object: Types.Objects.User = {
      id: model.id,
      name: model.name,
      email: model.email,
      roles: model.roles,
      status: model.status,
      token: model.token,
    }
    return object
  }

  return {
    fromRecord,
    toObject,
  }
}

export { User }
