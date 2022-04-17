export declare namespace ProductModel {
  type Photo = {
    url: string
  }
  type Status = 'active' | 'inactive'
}

export type ProductModel = {
  id: string
  storeId: string
  title: string
  description: string
  price: number
  photos: ProductModel.Photo[]
  status: ProductModel.Status
}
