export declare namespace UserRecord {
  type Status = 'active' | 'inactive' | 'awaiting';
  type Role = 'shopkeeper' | 'consumer';
}

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  roles: UserRecord.Role[];
  status: UserRecord.Status;
  validation_code: string | null;
};
