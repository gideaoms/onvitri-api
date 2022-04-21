import { User } from '@/types/user'
import { UserObject } from '@/types/objects/user'
import { UserRecord } from '@/types/records/user'

function UserMapper() {
  function fromRecord(record: UserRecord) {
    const model: User = {
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

  function toObject(model: User) {
    const object: UserObject = {
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

export default UserMapper
