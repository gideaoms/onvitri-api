export declare namespace ProductRecord {
  type Status = 'active' | 'inactive'
  type Photo = {
    url: string
  }
}

export type ProductRecord = {
  id: string
  store_id: string
  title: string
  description: string
  price: number
  status: ProductRecord.Status
  photos: ProductRecord.Photo[]
}
