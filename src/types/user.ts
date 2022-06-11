export declare namespace User {
  type Role = 'shopkeeper' | 'consumer';
  type Status = 'active' | 'inactive';
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: User.Role[];
  status: User.Status;
  token: string;
};
