declare module Product {
  type Photo = {
    url: string
  }

  type Status = 'active' | 'inactive'
}

type Product = {
  id: string
  store_id: string
  title: string
  description: string
  price: number
  photos: Product.Photo[]
  status: Product.Status
}

export { Product }
