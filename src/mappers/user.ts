import { User } from '@/types/user';
import { UserObject } from '@/types/objects/user';
import { UserRecord } from '@/types/records/user';

export function UserMapper() {
  function fromRecord(record: UserRecord) {
    const user: User = {
      id: record.id,
      name: record.name,
      email: record.email,
      roles: record.roles,
      status: record.status,
      token: '',
      validationCode: record.validation_code,
      password: record.password,
    };
    return user;
  }

  function toObject(user: User) {
    const object: UserObject = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      status: user.status,
      token: user.token,
    };
    return object;
  }

  function toRecord(user: User) {
    const record: UserRecord = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      status: user.status,
      validation_code: user.validationCode,
      password: user.password,
    };
    return record;
  }

  return {
    fromRecord: fromRecord,
    toObject: toObject,
    toRecord: toRecord,
  };
}
