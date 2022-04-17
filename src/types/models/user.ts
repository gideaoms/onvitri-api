export declare namespace UserModel {
  type Role = 'shopkeeper' | 'customer'
  type Status = 'active' | 'inactive'
}

export type UserModel = {
  id: string
  name: string
  email: string
  password: string
  roles: UserModel.Role[]
  status: UserModel.Status
  token: string
}
