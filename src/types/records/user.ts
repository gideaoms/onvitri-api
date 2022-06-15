export declare namespace UserRecord {
  type Status = 'active' | 'inactive' | 'awaiting';
  type Role = 'shopkeeper' | 'consumer';
}

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRecord.Role[];
  status: UserRecord.Status;
  email_code: string | null;
};
