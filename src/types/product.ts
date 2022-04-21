import { Photo } from './photo'

export declare namespace Product {
  type Status = 'active' | 'inactive'
}

export type Product = {
  id: string
  storeId: string
  title: string
  description: string
  price: number
  photos: Photo[]
  status: Product.Status
}
