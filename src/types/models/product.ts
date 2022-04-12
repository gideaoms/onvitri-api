import { Store } from '@/types/models/store'
import { City } from '@/types/models/city'

export declare module Product {
  type Photo = {
    url: string
  }

  type WithStore = Product & {
    store: Store & {
      city: City
    }
  }

  type Status = 'active' | 'inactive'
}

export type Product = {
  id: string
  storeId: string
  title: string
  description: string
  price: number
  photos: Product.Photo[]
  status: Product.Status
}
