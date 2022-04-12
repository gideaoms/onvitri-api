declare module User {
  type Status = 'active' | 'inactive'

  type Role = 'shopkeeper' | 'customer'
}

type User = {
  id: string
  name: string
  email: string
  password: string
  roles: User.Role[]
  status: User.Status
  token: string
}

export { User }
