export declare namespace ProductObject {
  type Photo = {
    url: string
  }
  type Status = 'active' | 'inactive'
}

export type ProductObject = {
  id: string
  store_id: string
  title: string
  description: string
  price: number
  photos: ProductObject.Photo[]
  status: ProductObject.Status
}
