import { Product } from '@/types/product'
import { Photo } from '@/types/photo'

function ProductModel() {
  function addPhotos(product: Product, photos: Photo[]) {
    const newProduct: Product = {
      ...product,
      photos: [...product.photos, ...photos],
    }
    return newProduct
  }

  function updateStatus(product: Product, status: Product.Status) {
    const newProduct: Product = {
      ...product,
      status: status,
    }
    return newProduct
  }

  function isActive(product: Product) {
    return product.status === 'active'
  }

  function hasPhotos(product: Product) {
    return product.photos.length > 0
  }

  return {
    addPhotos,
    updateStatus,
    isActive,
    hasPhotos,
  }
}

export default ProductModel
