export declare namespace UserObject {
  type Role = 'shopkeeper' | 'customer';
  type Status = 'active' | 'inactive';
}

export type UserObject = {
  id: string;
  name: string;
  email: string;
  roles: UserObject.Role[];
  status: UserObject.Status;
  token: string;
};
