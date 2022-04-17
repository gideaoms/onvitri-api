import { ProductModel } from '@/types/models/product'

function ProductModel() {
  function addPhoto(product: ProductModel, photo: ProductModel.Photo) {
    const newProduct: ProductModel = {
      ...product,
      photos: [...product.photos, photo],
    }
    return newProduct
  }

  return {
    addPhoto,
  }
}

export default ProductModel
