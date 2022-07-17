export declare namespace User {
  type Role = 'shopkeeper' | 'consumer';
  type Status = 'active' | 'inactive' | 'awaiting';
}

export type User = {
  id: string;
  name: string;
  email: string;
  emailCode: string | null;
  token: string;
  roles: User.Role[];
  status: User.Status;
};
