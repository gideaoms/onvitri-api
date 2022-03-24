import { Types } from '@/types'

function Product() {
  function addPhoto(product: Types.Models.Product, photo: Types.Models.Photo) {
    const newProduct: Types.Models.Product = {
      ...product,
      photos: [...product.photos, photo],
    }
    return newProduct
  }

  return {
    addPhoto,
  }
}

export { Product }
