import { Product } from '@/types/product';
import { Photo } from '@/types/photo';
import { ProductRepository } from '@/types/repositories/dashboard/product';

export function ProductModel(productRepository: ProductRepository) {
  function addPhotos(product: Product, photos: Photo[]) {
    const newProduct: Product = {
      ...product,
      photos: [...product.photos, ...photos],
    };
    return newProduct;
  }

  function updateStatus(product: Product, status: Product.Status) {
    const newProduct: Product = {
      ...product,
      status: status,
    };
    return newProduct;
  }

  function isActive(product: Product) {
    return product.status === 'active';
  }

  function hasPhotos(product: Product) {
    return product.photos.length > 0;
  }

  async function reachedMaximumActiveByStore(storeId: string, ownerId: string) {
    const amountOfActiveProductsByStore = await productRepository.getAmountOfActiveByStore(storeId, ownerId);
    return amountOfActiveProductsByStore >= ProductModel.maximumAmountActive;
  }

  return {
    addPhotos: addPhotos,
    updateStatus: updateStatus,
    isActive: isActive,
    hasPhotos: hasPhotos,
    reachedMaximumActiveByStore: reachedMaximumActiveByStore,
  };
}

ProductModel.maximumAmountActive = 25;

ProductModel.itemsByPage = 12;
