import { Product } from '@/types/product';
import { Photo } from '@/types/photo';
import { IProductRepository } from '@/types/repositories/dashboard/product';

function ProductModel(productRepository: IProductRepository) {
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

  async function reachedMaximumQuantityPublished(ownerId: string) {
    const activeProductsCount = await productRepository.activeProductsCount(ownerId);
    return activeProductsCount >= ProductModel.maximumQuantityPublished;
  }

  return {
    addPhotos,
    updateStatus,
    isActive,
    hasPhotos,
    reachedMaximumQuantityPublished,
  };
}

ProductModel.maximumQuantityPublished = 20;

ProductModel.itemsLimit = 12;

export default ProductModel;
