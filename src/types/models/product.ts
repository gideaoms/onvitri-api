import { Store } from '@/types/models/store'

declare module Product {
  type Photo = {
    url: string
  }

  type WithStore = Product & {
    store: Store
  }

  type Status = 'active' | 'inactive'
}

type Product = {
  id: string
  title: string
  description: string
  price: number
  photos: Product.Photo[]
  status: Product.Status
}

export { Product }
