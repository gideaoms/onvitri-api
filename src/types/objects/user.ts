declare module User {
  type Role = 'shopkeeper' | 'customer'

  type Status = 'active' | 'inactive'
}

type User = {
  id: string
  name: string
  email: string
  roles: User.Role[]
  status: User.Status
  token: string
}

export { User }
