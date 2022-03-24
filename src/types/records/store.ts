type StorePhone = {
  country_code: string
  area: string
  number: string
}

type StoreStatus = 'active' | 'inactive'

type Store = {
  id: string
  fantasy_name: string
  street: string
  number: string
  neighborhood: string
  phone: StorePhone
  status: StoreStatus
}

export { Store }
