declare module Store {
  type Phone = {
    country_code: string
    area: string
    number: string
  }

  type Status = 'active' | 'inactive'
}

type Store = {
  id: string
  fantasy_name: string
  street: string
  number: string
  neighborhood: string
  phone: Store.Phone
  status: Store.Status
}

export { Store }
