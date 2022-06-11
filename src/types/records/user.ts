export declare namespace UserRecord {
  type Status = 'active' | 'inactive';
  type Role = 'shopkeeper' | 'consumer';
}

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRecord.Role[];
  status: UserRecord.Status;
  token: string;
};
