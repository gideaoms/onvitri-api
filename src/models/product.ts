import { Product } from '@/types/product';
import { Picture } from '@/types/picture';

export function ProductModel() {
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

  function isValidPrice(product: Product) {
    return product.price >= 1; // cents
  }

  return {
    addPictures: addPictures,
    updateStatus: updateStatus,
    isActive: isActive,
    hasPictures: hasPictures,
    isValidPrice: isValidPrice,
  };
}

ProductModel.ITEMS_BY_PAGE = 12;
