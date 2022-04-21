import { User } from '@/types/user'
import { UserObject } from '@/types/objects/user'
import { UserRecord } from '@/types/records/user'

function UserMapper() {
  function fromRecord(record: UserRecord) {
    const user: User = {
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      roles: record.roles,
      status: record.status,
      token: record.token,
    }
    return user
  }

  function toObject(user: User) {
    const object: UserObject = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      status: user.status,
      token: user.token,
    }
    return object
  }

  return {
    fromRecord,
    toObject,
  }
}

export default UserMapper
