import { Product } from '@/types/models/product'
import { City } from '@/types/models/city'

declare module Store {
  type Phone = {
    countryCode: string
    area: string
    number: string
  }

  type Status = 'active' | 'inactive'

  type WithCityAndProducts = Store & {
    city: City
    products: Product[]
  }
}

type Store = {
  id: string
  fantasyName: string
  street: string
  number: string
  neighborhood: string
  phone: Store.Phone
  status: Store.Status
}

export { Store }
