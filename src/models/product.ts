import { Product } from '@/types/product';
import { Picture } from '@/types/picture';
import { ProductRepository } from '@/types/repositories/shopkeeper/product';

export function ProductModel(productRepository: ProductRepository) {
  function addPictures(product: Product, pictures: Picture[]) {
    const newProduct: Product = {
      ...product,
      pictures: [...product.pictures, ...pictures],
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

  function hasPictures(product: Product) {
    return product.pictures.length > 0;
  }

  async function canPublishToStore(storeId: string, ownerId: string) {
    const amountActiveProductsByStore = await productRepository.countActiveByStore(storeId, ownerId);
    return amountActiveProductsByStore >= ProductModel.MAXIMUM_ACTIVE_BY_STORE;
  }

  function isValidPrice(product: Product) {
    return product.price > 1; // cents
  }

  return {
    addPictures: addPictures,
    updateStatus: updateStatus,
    isActive: isActive,
    hasPictures: hasPictures,
    canPublishToStore: canPublishToStore,
    isValidPrice: isValidPrice,
  };
}

ProductModel.MAXIMUM_ACTIVE_BY_STORE = 25;

ProductModel.ITEMS_BY_PAGE = 12;
