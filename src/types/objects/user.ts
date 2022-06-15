export declare namespace UserObject {
  type Role = 'shopkeeper' | 'consumer';
  type Status = 'active' | 'inactive' | 'awaiting';
}

export type UserObject = {
  id: string;
  name: string;
  email: string;
  roles: UserObject.Role[];
  status: UserObject.Status;
  token: string;
};
